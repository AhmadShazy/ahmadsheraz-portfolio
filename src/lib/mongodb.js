import mongoose from "mongoose";

// Single shared MongoDB connection.
//
// Serverless functions and Next.js dev HMR both re-run module code often. Without
// caching we'd open a new connection every time and quickly exhaust the Atlas
// connection limit, so the connection (and the in-flight promise) are stashed on
// globalThis and reused.
const MONGODB_URI = process.env.MONGODB_URI;

// Pin the database explicitly instead of trusting the URI to carry it.
// A connection string without a `/<db>` path silently falls back to "test",
// which connects and authenticates fine but returns zero rows — a 200-OK
// failure that looks like "the site works but all content vanished". Setting
// dbName removes that whole class of misconfiguration.
const DB_NAME = process.env.MONGODB_DB || "portfolio";

let cached = globalThis._mongoose;
if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  // Already connected — reuse it
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (and to the Vercel project's environment variables)."
    );
  }

  // First caller kicks off the connection; everyone else awaits the same promise
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: DB_NAME,
        // Don't buffer queries forever if the DB is unreachable — fail fast so
        // API routes can return a real error instead of hanging.
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log(`[mongodb] connected to database "${m.connection.name}"`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Clear the failed promise so the next request retries instead of reusing it
    cached.promise = null;
    console.error("[mongodb] connection failed:", err.message);
    throw err;
  }

  return cached.conn;
}

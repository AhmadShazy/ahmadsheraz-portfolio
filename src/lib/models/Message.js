import mongoose from "mongoose";

// A contact-form submission. Stored alongside the Resend email so there's a
// durable record even if delivery ever fails, and so the admin inbox (Phase 3)
// has something to read.
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  receivedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  // Salted SHA-256 of the sender's IP — never the raw address. Used only to
  // rate-limit the public endpoint across serverless instances (an in-memory
  // counter would reset on every cold start). Not shown in the admin inbox.
  ipHash: { type: String, index: true, default: null },
});

// Newest first — the order the inbox reads them in
MessageSchema.index({ receivedAt: -1 });

// Supports the rate-limit query: "how many from this IP since <time>"
MessageSchema.index({ ipHash: 1, receivedAt: -1 });

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);

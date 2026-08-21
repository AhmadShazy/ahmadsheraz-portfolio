import connectDB from "@/lib/mongodb";
import ProfilePhoto from "@/lib/models/ProfilePhoto";

// GET /api/profile-photo — the admin-uploaded profile photo.
//
// Public and read-only by design: this image is on the home page, so there is
// nothing here to protect. It reads one document and writes nothing.
//
// Returns 404 when no photo has been uploaded, which is not an error — the
// About section falls back to the `public/profile-v2.jpg` that shipped with the
// repo, so a fresh database renders the original face rather than a hole.

// Never prerendered: the bytes come from the database, and a build-time
// snapshot would freeze whichever photo happened to be current.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await connectDB();
    const doc = await ProfilePhoto.findOne({ singleton: "main" })
      .select("data contentType updatedAt")
      .lean();

    if (!doc?.data) {
      return Response.json({ error: "No photo uploaded." }, { status: 404 });
    }

    // The caller is expected to pass ?v=<updatedAt>, which getProfilePhotoMeta
    // supplies. With a version in the URL the bytes for that URL can never
    // change, so they are safe to cache forever — a new upload produces a new
    // version and therefore a new URL. Without one, cache briefly instead:
    // someone hitting the bare path should not be stuck with an old face.
    const versioned = new URL(request.url).searchParams.has("v");
    const cache = versioned
      ? "public, max-age=31536000, immutable"
      : "public, max-age=60, must-revalidate";

    // .lean() hands back MongoDB's Binary wrapper, not a Node Buffer. Its
    // `.length` is a METHOD, so using it directly produced a Content-Length
    // header containing a stringified function — an invalid header value, which
    // threw and fell through to the 404 below. Normalise before reading length.
    const bytes = Buffer.isBuffer(doc.data)
      ? doc.data
      : Buffer.from(doc.data.buffer ?? doc.data);

    return new Response(bytes, {
      headers: {
        "Content-Type": doc.contentType,
        "Cache-Control": cache,
        "Content-Length": String(bytes.length),
        // Lets a conditional request skip the body entirely.
        ETag: `"${new Date(doc.updatedAt).getTime()}"`,
      },
    });
  } catch (err) {
    console.error("[profile-photo]", err.message);
    // 404 rather than 500 so the About section falls back to the bundled photo
    // instead of rendering a broken image while the database is unhappy.
    return Response.json({ error: "Not available." }, { status: 404 });
  }
}

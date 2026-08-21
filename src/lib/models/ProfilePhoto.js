import mongoose from "mongoose";

// The profile photo, stored as bytes so the admin panel can replace it.
//
// It used to be `public/profile-v2.jpg`, which meant changing it required a
// commit and a redeploy — Vercel's filesystem is read-only at runtime, so a
// running app can never write to `public/`.
//
// ── Why its own collection, not a field on SiteContent ──────────────────────
// SiteContent is read on every page render. A Buffer living there would be
// pulled into memory on each one unless every single query remembered to
// project it away, and the day someone adds a `.lean()` without that projection
// the whole image rides along silently. A separate collection is only ever read
// by the one route that serves the bytes.
//
// This is the right shape for ONE small image. It is not the right shape for a
// gallery — MongoDB documents cap at 16MB, and images belong on a CDN once
// there are several. If project screenshots ever become editable, move to blob
// storage rather than growing this.
const ProfilePhotoSchema = new mongoose.Schema(
  {
    // Exactly one, enforced the same way SiteContent does it.
    singleton: {
      type: String,
      default: "main",
      unique: true,
      enum: ["main"],
    },

    data: { type: Buffer, required: true },

    // Sent back as the Content-Type header. Stored rather than sniffed so the
    // serving route never has to guess.
    contentType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp"],
    },

    // Recorded so the public URL can carry a version and cache forever without
    // ever serving a stale face. See src/app/api/profile-photo/route.js.
    byteSize: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ProfilePhoto ||
  mongoose.model("ProfilePhoto", ProfilePhotoSchema);

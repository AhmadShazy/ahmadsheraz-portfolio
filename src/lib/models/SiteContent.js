import mongoose from "mongoose";

// The prose and small structured bits that don't warrant a collection of their
// own: hero, about, services, contact. Everything here used to be hardcoded in
// components, which meant the admin panel had nothing to edit.
//
// Deliberately ONE typed document rather than a generic { key, value: Mixed }
// settings store: real field names mean a typo is a schema error instead of a
// save that silently writes a key nothing reads.
const SiteContentSchema = new mongoose.Schema(
  {
    // There is exactly one of these. The enum + unique index makes a second
    // document impossible rather than merely discouraged.
    singleton: {
      type: String,
      default: "main",
      unique: true,
      enum: ["main"],
    },

    hero: {
      // Cycled by the typewriter, in this order
      roles: { type: [String], default: [] },
      tagline: { type: String, trim: true, default: "" },
      // Drives the gold pill in the hero and the one under the About photo
      availableForWork: { type: Boolean, default: true },
      availabilityLabel: { type: String, trim: true, default: "" },
    },

    about: {
      paragraphs: { type: [String], default: [] },
      // `full` makes a stat span both grid columns
      stats: [
        {
          _id: false,
          label: { type: String, trim: true },
          value: { type: String, trim: true },
          full: { type: Boolean, default: false },
        },
      ],
    },

    hireMe: {
      intro: { type: String, trim: true, default: "" },
      // `icon` is a lucide name resolved through an explicit map on the client —
      // an unknown name renders nothing rather than crashing the section.
      services: [
        {
          _id: false,
          icon: { type: String, trim: true },
          title: { type: String, trim: true },
          description: { type: String, trim: true },
        },
      ],
    },

    contact: {
      email: { type: String, trim: true, default: "" },
      blurb: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.SiteContent ||
  mongoose.model("SiteContent", SiteContentSchema);

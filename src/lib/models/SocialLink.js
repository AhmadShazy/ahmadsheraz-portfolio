import mongoose from "mongoose";

// An external profile link (GitHub, LinkedIn, …) shown in the hero and contact
// sections. One entry per platform.
const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true, trim: true, unique: true },
  url: { type: String, required: true, trim: true },
  // Icon identifier; brand marks are rendered as inline SVG on the client
  icon: { type: String, trim: true },
  order: { type: Number, default: 0 },
});

export default mongoose.models.SocialLink ||
  mongoose.model("SocialLink", SocialLinkSchema);

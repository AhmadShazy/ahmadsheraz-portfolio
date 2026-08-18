import mongoose from "mongoose";

// A role in the Experience timeline. Dates are free-form strings ("Jan 2025")
// rather than Dates because they're only ever displayed, never sorted on —
// `order` controls sequence.
const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  startDate: { type: String, trim: true },
  endDate: { type: String, trim: true },
  isCurrent: { type: Boolean, default: false },
  description: { type: String, trim: true },
  bullets: { type: [String], default: [] },
  order: { type: Number, default: 0 },
});

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);

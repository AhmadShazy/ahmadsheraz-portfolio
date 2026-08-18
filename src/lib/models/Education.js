import mongoose from "mongoose";

// A degree in the Education timeline.
const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  startYear: { type: Number },
  endYear: { type: Number },
  specialization: { type: String, trim: true },
  coursework: { type: [String], default: [] },
  // Final Year Project summary
  fyp: { type: String, trim: true },
});

export default mongoose.models.Education ||
  mongoose.model("Education", EducationSchema);

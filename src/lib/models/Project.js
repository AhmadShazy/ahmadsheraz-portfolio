import mongoose from "mongoose";

// A portfolio project. `rank` drives display order (1 = strongest work) and is
// unique so two projects can't claim the same slot.
const ProjectSchema = new mongoose.Schema({
  rank: { type: Number, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 0, max: 10 },
  techStack: { type: [String], default: [] },
  githubUrl: { type: String, trim: true },
  // Null until a project is actually deployed — the UI hides the Live button
  liveUrl: { type: String, trim: true, default: null },
  isPrivate: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

// Reuse the compiled model across HMR reloads / serverless invocations
export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);

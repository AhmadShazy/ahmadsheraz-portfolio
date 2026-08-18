import mongoose from "mongoose";

// Category names are fixed — they map 1:1 to the Skills section's group cards,
// so an unexpected value would render as an orphan group.
export const SKILL_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend & APIs",
  "AI / ML",
  "Data Engineering",
  "Databases",
  "DevOps & Tools",
];

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: SKILL_CATEGORIES },
  // Lucide icon name (e.g. "Code2"); resolved to a component on the client
  icon: { type: String, trim: true },
  // Order within the category
  order: { type: Number, default: 0 },
});

// A skill name can repeat across categories (e.g. InfluxDB), but not within one
SkillSchema.index({ category: 1, name: 1 }, { unique: true });

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

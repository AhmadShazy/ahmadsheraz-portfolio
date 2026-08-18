import connectDB from "./mongodb";
import Project from "./models/Project";
import Skill, { SKILL_CATEGORIES } from "./models/Skill";
import Experience from "./models/Experience";
import Education from "./models/Education";
import SocialLink from "./models/SocialLink";

// Shared read layer. Both the API routes (used by the Phase 3 admin panel) and
// the page's server components call these, so there's one query definition per
// content type. Server components call them directly rather than fetching their
// own API routes over HTTP — that would add a needless round-trip and can
// deadlock during static generation.
//
// `.lean()` returns plain objects instead of Mongoose documents, which is what
// React server components need to serialise.

function serialize(docs) {
  return docs.map(({ _id, __v, ...rest }) => ({ id: String(_id), ...rest }));
}

export async function getProjects() {
  await connectDB();
  const docs = await Project.find({}).sort({ rank: 1 }).lean();
  return serialize(docs);
}

// Returned pre-grouped in the fixed category order the Skills section renders.
// Empty categories are dropped so a missing group never renders an empty card.
export async function getSkillsGrouped() {
  await connectDB();
  const docs = await Skill.find({}).sort({ order: 1, name: 1 }).lean();
  const skills = serialize(docs);

  return SKILL_CATEGORIES.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  })).filter((group) => group.skills.length > 0);
}

export async function getExperience() {
  await connectDB();
  const docs = await Experience.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

export async function getEducation() {
  await connectDB();
  const docs = await Education.find({}).sort({ endYear: -1 }).lean();
  return serialize(docs);
}

export async function getSocialLinks() {
  await connectDB();
  const docs = await SocialLink.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

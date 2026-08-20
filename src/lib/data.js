import connectDB from "./mongodb";
import Project from "./models/Project";
import Skill, { SKILL_CATEGORIES } from "./models/Skill";
import Experience from "./models/Experience";
import Education from "./models/Education";
import SocialLink from "./models/SocialLink";
import SiteContent from "./models/SiteContent";

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

// `order` first so the sequence is explicit and stable; endYear only breaks
// ties for rows that haven't been ordered yet.
export async function getEducation() {
  await connectDB();
  const docs = await Education.find({}).sort({ order: 1, endYear: -1 }).lean();
  return serialize(docs);
}

export async function getSocialLinks() {
  await connectDB();
  const docs = await SocialLink.find({}).sort({ order: 1 }).lean();
  return serialize(docs);
}

// The single settings document behind the hero, about, hire-me and contact
// copy. Returns an empty shape rather than null when the document is missing,
// so a not-yet-seeded database renders an empty section instead of throwing —
// the same failure behaviour as every other content type here.
const EMPTY_SITE_CONTENT = {
  hero: { roles: [], tagline: "", availableForWork: false, availabilityLabel: "" },
  about: { paragraphs: [], stats: [] },
  hireMe: { intro: "", services: [] },
  contact: { email: "", blurb: "" },
};

export async function getSiteContent() {
  await connectDB();
  const doc = await SiteContent.findOne({ singleton: "main" }).lean();
  if (!doc) return EMPTY_SITE_CONTENT;

  return {
    hero: { ...EMPTY_SITE_CONTENT.hero, ...(doc.hero || {}) },
    about: { ...EMPTY_SITE_CONTENT.about, ...(doc.about || {}) },
    hireMe: { ...EMPTY_SITE_CONTENT.hireMe, ...(doc.hireMe || {}) },
    contact: { ...EMPTY_SITE_CONTENT.contact, ...(doc.contact || {}) },
  };
}

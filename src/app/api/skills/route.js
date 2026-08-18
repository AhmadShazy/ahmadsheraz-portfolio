import { getSkillsGrouped } from "@/lib/data";

// GET /api/skills — skills grouped by category, in display order
export async function GET() {
  try {
    const groups = await getSkillsGrouped();
    return Response.json({ groups });
  } catch (err) {
    console.error("[api/skills]", err.message);
    return Response.json({ error: "Failed to load skills." }, { status: 500 });
  }
}

import { getEducation } from "@/lib/data";

// GET /api/education — degrees, most recent first
export async function GET() {
  try {
    const education = await getEducation();
    return Response.json({ education });
  } catch (err) {
    console.error("[api/education]", err.message);
    return Response.json(
      { error: "Failed to load education." },
      { status: 500 }
    );
  }
}

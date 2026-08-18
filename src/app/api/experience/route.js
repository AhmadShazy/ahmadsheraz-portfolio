import { getExperience } from "@/lib/data";

// GET /api/experience — roles in display order
export async function GET() {
  try {
    const experience = await getExperience();
    return Response.json({ experience });
  } catch (err) {
    console.error("[api/experience]", err.message);
    return Response.json(
      { error: "Failed to load experience." },
      { status: 500 }
    );
  }
}

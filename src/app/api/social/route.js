import { getSocialLinks } from "@/lib/data";

// GET /api/social — external profile links in display order
export async function GET() {
  try {
    const social = await getSocialLinks();
    return Response.json({ social });
  } catch (err) {
    console.error("[api/social]", err.message);
    return Response.json(
      { error: "Failed to load social links." },
      { status: 500 }
    );
  }
}

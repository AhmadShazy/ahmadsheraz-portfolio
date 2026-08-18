import { getProjects } from "@/lib/data";

// GET /api/projects — all projects, strongest first (rank ascending)
export async function GET() {
  try {
    const projects = await getProjects();
    return Response.json({ projects });
  } catch (err) {
    console.error("[api/projects]", err.message);
    return Response.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

import SectionWrapper from "@/components/shared/SectionWrapper";
import { getProjects } from "@/lib/data";
import ProjectsGrid from "./ProjectsGrid";

// Server component: reads projects straight from the data layer at build /
// revalidate time (see `revalidate` in src/app/page.js), so visitors get static
// HTML instead of waiting on a database round-trip.
export default async function ProjectsSection() {
  let projects = [];
  let failed = false;
  try {
    projects = await getProjects();
  } catch {
    failed = true;
  }

  return (
    <SectionWrapper id="projects" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading + underline + subheading */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Featured Projects
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-teal" />
          <p className="mt-4 text-base text-text-secondary">
            Ranked by complexity, AI depth, and real-world impact
          </p>
        </div>

        {failed ? (
          <p className="text-base font-medium text-teal">
            Failed to load — please refresh.
          </p>
        ) : (
          <ProjectsGrid projects={projects} />
        )}
      </div>
    </SectionWrapper>
  );
}

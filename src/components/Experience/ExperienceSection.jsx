import SectionWrapper from "@/components/shared/SectionWrapper";
import { getExperience } from "@/lib/data";
import ExperienceTimeline from "./ExperienceTimeline";

// Server component: fetches roles from the data layer in display order.
export default async function ExperienceSection() {
  let experience = [];
  let failed = false;
  try {
    experience = await getExperience();
  } catch {
    failed = true;
  }

  return (
    <SectionWrapper id="experience" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Heading with teal underline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Experience
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-teal" />
        </div>

        {failed ? (
          <p className="text-base font-medium text-teal">
            Failed to load — please refresh.
          </p>
        ) : (
          <ExperienceTimeline experience={experience} />
        )}
      </div>
    </SectionWrapper>
  );
}

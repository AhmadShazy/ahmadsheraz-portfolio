import SectionWrapper from "@/components/shared/SectionWrapper";
import { getEducation } from "@/lib/data";
import EducationTimeline from "./EducationTimeline";

// Server component: fetches degrees from the data layer, most recent first.
export default async function EducationSection() {
  let education = [];
  let failed = false;
  try {
    education = await getEducation();
  } catch {
    failed = true;
  }

  return (
    <SectionWrapper id="education" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl">
        {/* Heading with teal underline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Education
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-teal" />
        </div>

        {failed ? (
          <p className="text-base font-medium text-teal">
            Failed to load — please refresh.
          </p>
        ) : (
          <EducationTimeline education={education} />
        )}
      </div>
    </SectionWrapper>
  );
}

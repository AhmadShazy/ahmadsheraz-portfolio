import SectionWrapper from "@/components/shared/SectionWrapper";
import { getSkillsGrouped } from "@/lib/data";
import SkillsGrid from "./SkillsGrid";

// Server component: skills come back from the data layer already grouped in the
// fixed category order, so the client half only has to render them.
export default async function SkillsSection() {
  let groups = [];
  let failed = false;
  try {
    groups = await getSkillsGrouped();
  } catch {
    failed = true;
  }

  return (
    <SectionWrapper id="skills" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading with exact 48x3 teal underline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Skills &amp; Technologies
          </h2>
          <div
            style={{
              width: "48px",
              height: "3px",
              background: "#0D9488",
              borderRadius: "2px",
              marginTop: "12px",
            }}
          />
        </div>

        {failed ? (
          <p className="text-base font-medium text-teal">
            Failed to load — please refresh.
          </p>
        ) : (
          <SkillsGrid groups={groups} />
        )}
      </div>
    </SectionWrapper>
  );
}

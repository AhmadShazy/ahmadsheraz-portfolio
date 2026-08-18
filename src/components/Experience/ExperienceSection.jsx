"use client";

import { useRef } from "react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import ExperienceCard from "./ExperienceCard";

// Experience data. No professional roles yet, so we show the placeholder card
// from CONTEXT.md (positioned as actively seeking, not as a gap).
const EXPERIENCE = [
  {
    role: "Actively Seeking First Industry Role",
    company: "Open to AI Engineering · Data Engineering · Backend Engineering positions",
    bullets: [
      "Currently focused on building production-grade AI systems and data pipelines through academic projects and self-directed development.",
    ],
  },
];

// Experience timeline — mirrors EducationSection: cards stagger in on scroll
// with a desktop teal rail/node, inside a SectionWrapper-driven section fade.
export default function ExperienceSection() {
  const listRef = useRef(null);

  // Stagger the timeline cards in on scroll (respects reduced motion)
  useStaggerReveal(listRef, "[data-timeline-item]");

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

        {/* Timeline */}
        <div ref={listRef} className="relative">
          {/* Vertical connecting rail (desktop only) */}
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-teal/30 lg:block"
          />

          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <div key={i} data-timeline-item className="relative lg:pl-10">
                {/* Timeline node (desktop only) */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-6 hidden h-3.5 w-3.5 rounded-full bg-teal ring-4 ring-white/60 lg:block"
                />
                <ExperienceCard {...exp} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

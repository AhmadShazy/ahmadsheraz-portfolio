"use client";

import { useRef } from "react";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import ExperienceCard from "./ExperienceCard";

// Client half of the Experience section: staggered reveal + the desktop rail.
export default function ExperienceTimeline({ experience }) {
  const listRef = useRef(null);
  useStaggerReveal(listRef, "[data-timeline-item]");

  // "Jan 2024 – Present" when dates exist; blank otherwise
  const formatDuration = (exp) => {
    if (!exp.startDate) return "";
    const end = exp.isCurrent ? "Present" : exp.endDate;
    return end ? `${exp.startDate} – ${end}` : exp.startDate;
  };

  return (
    <div ref={listRef} className="relative">
      {/* Vertical connecting rail (desktop only) */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-teal/30 lg:block"
      />

      <div className="space-y-6">
        {experience.map((exp) => (
          <div
            key={exp.id ?? exp.role}
            data-timeline-item
            className="relative lg:pl-10"
          >
            {/* Timeline node (desktop only) */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-6 hidden h-3.5 w-3.5 rounded-full bg-teal ring-4 ring-white/60 lg:block"
            />
            <ExperienceCard
              role={exp.role}
              company={exp.company}
              duration={formatDuration(exp)}
              bullets={exp.bullets}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import EducationCard from "./EducationCard";

// Client half of the Education section: staggered reveal + the desktop rail.
export default function EducationTimeline({ education }) {
  const listRef = useRef(null);
  useStaggerReveal(listRef, "[data-timeline-item]");

  return (
    <div ref={listRef} className="relative">
      {/* Vertical connecting rail (desktop only) */}
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-teal/30 lg:block"
      />

      <div className="space-y-6">
        {education.map((edu) => (
          <div
            key={edu.id ?? edu.degree}
            data-timeline-item
            className="relative lg:pl-10"
          >
            {/* Timeline node (desktop only) */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-6 hidden h-3.5 w-3.5 rounded-full bg-teal ring-4 ring-white/60 lg:block"
            />
            <EducationCard
              degree={edu.degree}
              university={edu.institution}
              duration={
                edu.startYear && edu.endYear
                  ? `${edu.startYear} – ${edu.endYear}`
                  : ""
              }
              specialization={edu.specialization}
              coursework={edu.coursework}
              fyp={edu.fyp}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

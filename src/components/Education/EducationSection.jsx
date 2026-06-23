"use client";

import { useRef } from "react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import EducationCard from "./EducationCard";

// Education data — verbatim from CONTEXT.md (single source of truth)
const EDUCATION = [
  {
    degree: "Bachelor of Science in Computer Science",
    university: "COMSATS University Islamabad, Lahore Campus",
    duration: "2023 – 2027",
    specialization: "AI/ML · Data Engineering · Backend Engineering",
    coursework: [
      "Data Structures",
      "Algorithms",
      "Machine Learning",
      "Database Systems",
      "Computer Networks",
      "Parallel & Distributed Computing",
      "Computer Vision",
    ],
    fyp: "Emotion Detection System — Multimodal AI using Whisper + SpeechBrain + OpenFace",
  },
];

// Education timeline. Cards stagger in on scroll (GSAP) and, on desktop, sit
// alongside a vertical teal rail with a node per card. The surrounding section
// fade comes from SectionWrapper; the parent section starts hidden so the cards
// never flash before their staggered reveal runs.
export default function EducationSection() {
  const listRef = useRef(null);

  // Stagger the timeline cards in on scroll (respects reduced motion)
  useStaggerReveal(listRef, "[data-timeline-item]");

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

        {/* Timeline */}
        <div ref={listRef} className="relative">
          {/* Vertical connecting rail (desktop only) */}
          <span
            aria-hidden="true"
            className="absolute left-[7px] top-3 bottom-3 hidden w-px bg-teal/30 lg:block"
          />

          <div className="space-y-6">
            {EDUCATION.map((edu) => (
              <div
                key={edu.degree}
                data-timeline-item
                className="relative lg:pl-10"
              >
                {/* Timeline node (desktop only) */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-6 hidden h-3.5 w-3.5 rounded-full bg-teal ring-4 ring-white/60 lg:block"
                />
                <EducationCard {...edu} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

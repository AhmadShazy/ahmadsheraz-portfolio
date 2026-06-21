"use client";

import {
  Code2,
  Layout,
  Server,
  BrainCircuit,
  Workflow,
  Database,
  Wrench,
} from "lucide-react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import SkillCard from "./SkillCard";

// Skill groups — names and grouping verbatim from CONTEXT.md. Each group has a
// representative Lucide icon shared by its cards.
const SKILL_GROUPS = [
  {
    label: "Languages",
    Icon: Code2,
    skills: ["Python", "JavaScript", "SQL", "C++"],
  },
  {
    label: "Frontend",
    Icon: Layout,
    skills: ["React.js", "Next.js", "Tailwind CSS", "Three.js / R3F", "HTML/CSS"],
  },
  {
    label: "Backend & APIs",
    Icon: Server,
    skills: ["FastAPI", "Node.js", "Express.js", "REST APIs", "JWT Authentication"],
  },
  {
    label: "AI / ML",
    Icon: BrainCircuit,
    skills: [
      "Google Gemini API",
      "OpenAI Whisper",
      "SpeechBrain",
      "OpenFace",
      "OpenCV",
      "scikit-learn",
      "Deep Learning",
    ],
  },
  {
    label: "Data Engineering",
    Icon: Workflow,
    skills: [
      "Apache Kafka",
      "Apache Spark (PySpark)",
      "MQTT (Mosquitto)",
      "InfluxDB",
      "Grafana",
    ],
  },
  {
    label: "Databases",
    Icon: Database,
    skills: ["MongoDB", "MySQL", "InfluxDB"],
  },
  {
    label: "DevOps & Tools",
    Icon: Wrench,
    skills: [
      "Docker",
      "Docker Compose",
      "Git",
      "GitHub",
      "Vercel",
      "Render",
      "Linux",
      "Postman",
    ],
  },
];

// Skills section: grouped grids of tilt-on-hover glass cards. Responsive grid
// goes 2 cols (mobile) -> 3 (tablet) -> 4 (lg) -> 5 (xl). Reveals on scroll via
// SectionWrapper.
export default function SkillsSection() {
  return (
    <SectionWrapper id="skills" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading with teal underline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Skills &amp; Technologies
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-teal" />
        </div>

        {/* Each group: teal label + responsive grid of skill cards */}
        <div className="space-y-10">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-teal">
                {group.label}
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {group.skills.map((skill) => (
                  <SkillCard key={skill} name={skill} Icon={group.Icon} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

"use client";

import {
  Code2,
  Braces,
  Database,
  Binary,
  Atom,
  Triangle,
  Wind,
  Box,
  FileCode,
  Zap,
  Hexagon,
  Route,
  Webhook,
  ShieldCheck,
  Sparkles,
  Mic,
  AudioLines,
  ScanFace,
  Eye,
  LineChart,
  BrainCircuit,
  Workflow,
  Flame,
  Radio,
  Activity,
  BarChart3,
  Leaf,
  Container,
  Layers,
  GitBranch,
  Cloud,
  Server,
  Terminal,
  Send,
} from "lucide-react";
import { useRef } from "react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import SkillCard from "./SkillCard";

// Inline GitHub mark — this lucide-react version ships no brand icons. Mirrors
// the Lucide API (size + color) so it drops into SkillRow like any other icon.
function GithubIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

// Skill categories — names and grouping exactly as specified for the Option D
// redesign. Each skill is paired with a best-fit Lucide icon.
const SKILL_CARDS = [
  {
    title: "Languages",
    twoCol: false,
    skills: [
      { icon: Code2, name: "Python" },
      { icon: Braces, name: "JavaScript" },
      { icon: Database, name: "SQL" },
      { icon: Binary, name: "C++" },
    ],
  },
  {
    title: "Frontend",
    twoCol: false,
    skills: [
      { icon: Atom, name: "React.js" },
      { icon: Triangle, name: "Next.js" },
      { icon: Wind, name: "Tailwind CSS" },
      { icon: Box, name: "Three.js / R3F" },
      { icon: FileCode, name: "HTML/CSS" },
    ],
  },
  {
    title: "Backend & APIs",
    twoCol: false,
    skills: [
      { icon: Zap, name: "FastAPI" },
      { icon: Hexagon, name: "Node.js" },
      { icon: Route, name: "Express.js" },
      { icon: Webhook, name: "REST APIs" },
      { icon: ShieldCheck, name: "JWT Auth" },
    ],
  },
  {
    title: "AI / ML",
    twoCol: true,
    skills: [
      { icon: Sparkles, name: "Gemini API" },
      { icon: Mic, name: "OpenAI Whisper" },
      { icon: AudioLines, name: "SpeechBrain" },
      { icon: ScanFace, name: "OpenFace" },
      { icon: Eye, name: "OpenCV" },
      { icon: LineChart, name: "scikit-learn" },
      { icon: BrainCircuit, name: "Deep Learning" },
    ],
  },
  {
    title: "Data Engineering",
    twoCol: false,
    skills: [
      { icon: Workflow, name: "Apache Kafka" },
      { icon: Flame, name: "Apache Spark (PySpark)" },
      { icon: Radio, name: "MQTT (Mosquitto)" },
      { icon: Activity, name: "InfluxDB" },
      { icon: BarChart3, name: "Grafana" },
    ],
  },
  {
    title: "Databases",
    twoCol: false,
    skills: [
      { icon: Leaf, name: "MongoDB" },
      { icon: Database, name: "MySQL" },
      { icon: Activity, name: "InfluxDB" },
    ],
  },
  {
    title: "DevOps & Tools",
    twoCol: true,
    skills: [
      { icon: Container, name: "Docker" },
      { icon: Layers, name: "Docker Compose" },
      { icon: GitBranch, name: "Git" },
      { icon: GithubIcon, name: "GitHub" },
      { icon: Cloud, name: "Vercel" },
      { icon: Server, name: "Render" },
      { icon: Terminal, name: "Linux" },
      { icon: Send, name: "Postman" },
    ],
  },
];

// Skills section: an auto-fitting grid of category glass cards. Collapses to a
// single column on mobile and grows with the viewport. Reveals on scroll via
// SectionWrapper.
export default function SkillsSection() {
  const gridRef = useRef(null);

  // Stagger the category cards in on scroll (respects reduced motion)
  useStaggerReveal(gridRef);

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

        {/* Auto-fit card grid. align-items: stretch (the default) lets every
            card in a row grow to the tallest one's height. */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "12px",
            alignItems: "stretch",
          }}
        >
          {SKILL_CARDS.map((card) => (
            <div key={card.title} data-reveal-item className="h-full">
              <SkillCard
                title={card.title}
                skills={card.skills}
                twoCol={card.twoCol}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

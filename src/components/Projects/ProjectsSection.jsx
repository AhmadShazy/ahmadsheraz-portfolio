"use client";

import { useRef } from "react";
import SectionWrapper from "@/components/shared/SectionWrapper";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import ProjectCard from "./ProjectCard";

// All 7 projects in ranked order — verbatim from CONTEXT.md (single source of
// truth). "Bike Buying Analysis" is intentionally excluded. No live URLs yet.
const PROJECTS = [
  {
    rank: 1,
    rating: 9.4,
    isStarred: true,
    title: "JobCraft AI",
    description:
      "AI-powered job application generator. Paste a job description, get a tailored resume + cover letter as .docx. Includes a Q&A assistant that answers screening questions in the user's own voice.",
    techStack: ["React 19", "FastAPI", "MongoDB", "Gemini API", "JWT", "Docker", "Resend"],
    githubUrl: "https://github.com/AhmadShazy/JobCraft-AI-Application-Generator",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 2,
    rating: 9.1,
    isStarred: false,
    title: "Emotion Detection System",
    description:
      "Multimodal Humanoid Assistant — detects human emotion in real time from speech and facial expressions simultaneously. Three cutting-edge AI models fused together.",
    techStack: ["Python", "Whisper", "SpeechBrain", "Wav2Vec2", "OpenFace"],
    githubUrl: "https://github.com/AhmadShazy/Emotion-Detection-System",
    liveUrl: null,
    isPrivate: true,
  },
  {
    rank: 3,
    rating: 8.7,
    isStarred: false,
    title: "Smart Grid Energy Monitoring",
    description:
      "Real-time parallel and distributed IoT data pipeline for smart grid energy monitoring. Handles high-velocity household energy data streams at scale.",
    techStack: ["MQTT", "Apache Kafka", "PySpark", "InfluxDB", "Grafana", "Python"],
    githubUrl: "https://github.com/AhmadShazy/smart-grid-energy-monitoring",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 4,
    rating: 7.8,
    isStarred: false,
    title: "Visual Cryptography Engine",
    description:
      "Securely encrypts and decrypts binary and RGB/grayscale images using a custom XOR One-Time Pad (OTP) algorithm with 2x pixel expansion.",
    techStack: ["Python", "NumPy", "PIL"],
    githubUrl: "https://github.com/AhmadShazy/-visual-cryptography-encryption-engine",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 5,
    rating: 7.3,
    isStarred: false,
    title: "Face Recognition Attendance System",
    description:
      "GUI-based face recognition attendance tracking system with a complete CV pipeline — real-time face detection, recognition, and automated attendance logging.",
    techStack: ["Python", "OpenCV", "Haar Cascade", "LBPH"],
    githubUrl: "https://github.com/AhmadShazy/Face_Recognition_App",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 6,
    rating: 6.2,
    isStarred: false,
    title: "Income Predictor",
    description:
      "End-to-end ML pipeline predicting whether an individual earns over $50K/year. Includes full EDA, feature engineering with PCA, and comparative classification models.",
    techStack: ["Python", "scikit-learn", "Pandas", "PCA", "Jupyter"],
    githubUrl: "https://github.com/AhmadShazy/Income-Predictor",
    liveUrl: null,
    isPrivate: false,
  },
  {
    rank: 7,
    rating: 5.9,
    isStarred: false,
    title: "Fullstack E-Commerce",
    description:
      "Responsive full-stack e-commerce application with secure authentication, persistent shopping carts, and a dedicated admin dashboard.",
    techStack: ["Node.js", "EJS", "Tailwind CSS", "Express.js"],
    githubUrl: "https://github.com/AhmadShazy/fullstack-ecommerce-node",
    liveUrl: null,
    isPrivate: false,
  },
];

// Projects section: ranked grid of 3D-depth glass cards. Responsive grid goes
// 1 col (mobile) -> 2 (tablet) -> 3 (desktop). Reveals on scroll via SectionWrapper.
export default function ProjectsSection() {
  const gridRef = useRef(null);

  // Stagger the project cards in on scroll (respects reduced motion)
  useStaggerReveal(gridRef);

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

        {/* Ranked project grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROJECTS.map((project) => (
            <div key={project.rank} data-reveal-item className="h-full">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

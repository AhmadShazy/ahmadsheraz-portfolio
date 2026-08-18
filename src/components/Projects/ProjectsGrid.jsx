"use client";

import { useRef } from "react";
import useStaggerReveal from "@/hooks/useStaggerReveal";
import ProjectCard from "./ProjectCard";

// Client half of the Projects section: owns the staggered scroll reveal (which
// needs a ref + effect). Data is fetched by the server component and passed in.
export default function ProjectsGrid({ projects }) {
  const gridRef = useRef(null);
  useStaggerReveal(gridRef);

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <div key={project.id ?? project.rank} data-reveal-item className="h-full">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}

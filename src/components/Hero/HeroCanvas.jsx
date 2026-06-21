"use client";

import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import Globe3D from "./Globe3D";
import Particles3D from "./Particles3D";
import GeometricObject from "./GeometricObject";
import useReducedMotion from "@/hooks/useReducedMotion";

// Assembles the three 3D elements into a single transparent R3F canvas that
// fills its parent container. Detects mobile (<=767px) to pass a perf flag down
// to the children (fewer segments/particles, no mouse interaction).
//
// `inView` (from HeroSection's IntersectionObserver) lets the render loop pause
// when the hero is scrolled off-screen on the long single-page layout.
export default function HeroCanvas({ inView = true }) {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Freeze the render loop (single static frame, no rAF churn) when the user
  // prefers reduced motion or the hero is not currently on screen.
  const frameloop = prefersReduced || !inView ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 2]} // cap pixel ratio so retina phones don't over-render
      style={{ width: "100%", height: "100%" }}
    >
      {/* Scene lighting (shared by all meshes) */}
      <ambientLight intensity={0.4} />
      <directionalLight color="#ffffff" intensity={0.8} position={[5, 5, 5]} />

      <Globe3D isMobile={isMobile} />
      <Particles3D isMobile={isMobile} />
      <GeometricObject isMobile={isMobile} />
    </Canvas>
  );
}

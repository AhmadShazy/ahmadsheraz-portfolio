"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

// A slowly rotating teal wireframe globe sitting in the background, slightly
// behind and to the right of the scene. Segment count drops on mobile to keep
// the geometry cheap. Scene lighting is provided by HeroCanvas.
export default function Globe3D({ isMobile = false }) {
  const meshRef = useRef();

  // Fewer segments on mobile for performance
  const segments = isMobile ? 32 : 64;

  // Slow, continuous spin on the Y axis
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={meshRef} position={[1.6, 0.4, -1.5]}>
      <sphereGeometry args={[1.5, segments, segments]} />
      <meshStandardMaterial color="#0D9488" wireframe />
    </mesh>
  );
}

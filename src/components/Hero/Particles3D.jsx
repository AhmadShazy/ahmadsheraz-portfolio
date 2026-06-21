"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import useMousePosition from "@/hooks/useMousePosition";

// Volume radius the particles are scattered within / reset against
const BOUND = 4;

// A cloud of gold particles that drift slowly upward (wrapping around when they
// pass the top) and, on desktop, the whole cloud eases gently toward the cursor.
// Particle count drops and mouse interaction is disabled on mobile.
export default function Particles3D({ isMobile = false }) {
  const pointsRef = useRef();
  // Only track the cursor on desktop; on mobile the listener isn't attached
  const mouse = useMousePosition(!isMobile);

  const count = isMobile ? 60 : 150;

  // Generate random starting positions inside a sphere volume (once per count).
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniformly distribute points within the sphere volume
      const r = BOUND * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    const points = pointsRef.current;
    if (!points) return;

    // Drift each particle upward; wrap back to the bottom when it exits the top
    const arr = points.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.01;
      if (arr[i * 3 + 1] > BOUND) {
        arr[i * 3 + 1] = -BOUND;
      }
    }
    points.geometry.attributes.position.needsUpdate = true;

    // Desktop only: ease the whole cloud subtly toward the cursor (lerp).
    // On mobile, ease it back to center instead, so a desktop->tablet resize
    // doesn't leave the cloud frozen at its last cursor offset.
    if (!isMobile) {
      const targetX = mouse.current.x * 0.5;
      const targetY = mouse.current.y * 0.5;
      points.position.x += (targetX - points.position.x) * 0.02;
      points.position.y += (targetY - points.position.y) * 0.02;
    } else {
      points.position.x += (0 - points.position.x) * 0.05;
      points.position.y += (0 - points.position.y) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#F59E0B"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import useMousePosition from "@/hooks/useMousePosition";

// A glassy teal icosahedron sitting center-right. The inner mesh spins
// continuously on all three axes (different speeds) and bobs up and down; the
// outer group tilts gently toward the cursor on desktop. Separating the two
// onto different objects keeps the cursor tilt from fighting the constant spin.
export default function GeometricObject({ isMobile = false }) {
  const groupRef = useRef();
  const meshRef = useRef();
  // Only track the cursor on desktop; on mobile the listener isn't attached
  const mouse = useMousePosition(!isMobile);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Inner mesh: continuous multi-axis rotation + gentle vertical bob
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.004;
      meshRef.current.rotation.y += 0.006;
      meshRef.current.rotation.z += 0.002;
      meshRef.current.position.y = Math.sin(t) * 0.2;
    }

    // Outer group: ease a slight tilt toward the cursor (desktop only). On
    // mobile, ease back to neutral so a desktop->tablet resize doesn't leave
    // the object frozen at its last cursor tilt.
    if (groupRef.current) {
      const targetX = isMobile ? 0 : mouse.current.y * 0.3;
      const targetY = isMobile ? 0 : mouse.current.x * 0.3;
      groupRef.current.rotation.x +=
        (targetX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y +=
        (targetY - groupRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0.6, -0.2, 0.5]}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshPhongMaterial
          color="#0D9488"
          shininess={100}
          emissive="#0D9488"
          emissiveIntensity={0.35}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

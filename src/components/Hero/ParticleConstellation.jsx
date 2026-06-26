"use client";

import { useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// --- Tunables -------------------------------------------------------------
const NODE_COUNT = 80;
const RANGE_X = 12; // half-extents of the node volume
const RANGE_Y = 7;
const RANGE_Z = 6;
const DRIFT_SPEED = 0.45; // units/second
const CONNECT_DIST = 3.2; // nodes closer than this get a line
const CONNECT_DIST2 = CONNECT_DIST * CONNECT_DIST;
const REPEL_RADIUS = 2.6; // cursor influence radius (screen plane)
const REPEL_R2 = REPEL_RADIUS * REPEL_RADIUS;
const REPEL_STRENGTH = 0.55;
const ROTATION_SPEED = 0.04; // radians/second around Y
const TEAL = "#0D9488";
// Worst-case segment count = C(NODE_COUNT, 2). The line buffer is sized for
// this once and reused every frame (never reallocated).
const MAX_SEGMENTS = (NODE_COUNT * (NODE_COUNT - 1)) / 2;

// Deterministic pseudo-random in [0, 1) — pure, so node generation needs no
// impure Math.random() call.
function hash(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Build the node buffers + pre-allocated geometries once.
function createField() {
  const positions = new Float32Array(NODE_COUNT * 3);
  const velocities = new Float32Array(NODE_COUNT * 3);
  for (let i = 0; i < NODE_COUNT; i++) {
    positions[i * 3] = (hash(i + 1) - 0.5) * 2 * RANGE_X;
    positions[i * 3 + 1] = (hash(i + 101) - 0.5) * 2 * RANGE_Y;
    positions[i * 3 + 2] = (hash(i + 211) - 0.5) * 2 * RANGE_Z;
    velocities[i * 3] = (hash(i + 331) - 0.5) * DRIFT_SPEED;
    velocities[i * 3 + 1] = (hash(i + 457) - 0.5) * DRIFT_SPEED;
    velocities[i * 3 + 2] = (hash(i + 577) - 0.5) * DRIFT_SPEED;
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Pre-allocate the line buffer for the worst case; reused via setDrawRange.
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(MAX_SEGMENTS * 2 * 3), 3)
  );
  lineGeometry.setDrawRange(0, 0);

  return { positions, velocities, pointsGeometry, lineGeometry };
}

// Rebuild line segments from current node positions into the pre-allocated
// buffer (no per-frame allocation). `count` is set as vertices via setDrawRange.
function rebuildLines(field) {
  const { positions, lineGeometry } = field;
  const arr = lineGeometry.attributes.position.array;
  let w = 0;
  for (let i = 0; i < NODE_COUNT; i++) {
    const ix = i * 3;
    const ax = positions[ix];
    const ay = positions[ix + 1];
    const az = positions[ix + 2];
    for (let j = i + 1; j < NODE_COUNT; j++) {
      const jx = j * 3;
      const dx = ax - positions[jx];
      const dy = ay - positions[jx + 1];
      const dz = az - positions[jx + 2];
      if (dx * dx + dy * dy + dz * dz < CONNECT_DIST2) {
        arr[w++] = ax;
        arr[w++] = ay;
        arr[w++] = az;
        arr[w++] = positions[jx];
        arr[w++] = positions[jx + 1];
        arr[w++] = positions[jx + 2];
      }
    }
  }
  lineGeometry.setDrawRange(0, w / 3); // count is vertices, not floats
  lineGeometry.attributes.position.needsUpdate = true;
}

// Advance one animation step: drift + bounce + cursor repel, then rebuild lines.
function stepField(field, group, pointer, viewport, dt) {
  const { positions, velocities, pointsGeometry } = field;

  // Slow Y rotation of the whole field (parallax)
  group.rotation.y += ROTATION_SPEED * dt;
  const theta = group.rotation.y;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  // Cursor projected onto the z=0 plane in world units
  const px = (pointer.x * viewport.width) / 2;
  const py = (pointer.y * viewport.height) / 2;

  for (let i = 0; i < NODE_COUNT; i++) {
    const ix = i * 3;
    const iy = ix + 1;
    const iz = ix + 2;

    // Drift
    positions[ix] += velocities[ix] * dt;
    positions[iy] += velocities[iy] * dt;
    positions[iz] += velocities[iz] * dt;

    // Bounce at the volume bounds (no teleport pops)
    if (positions[ix] > RANGE_X || positions[ix] < -RANGE_X) velocities[ix] *= -1;
    if (positions[iy] > RANGE_Y || positions[iy] < -RANGE_Y) velocities[iy] *= -1;
    if (positions[iz] > RANGE_Z || positions[iz] < -RANGE_Z) velocities[iz] *= -1;

    // Repel from the cursor in screen space, accounting for the group's Y
    // rotation: project the node to world XY, push away there, then convert the
    // push back into local space (inverse Y rotation, push.z = 0).
    const wx = positions[ix] * cos + positions[iz] * sin; // world X after rotation
    const dx = wx - px;
    const dy = positions[iy] - py;
    const d2 = dx * dx + dy * dy;
    if (d2 < REPEL_R2 && d2 > 1e-4) {
      const d = Math.sqrt(d2);
      const push = ((REPEL_RADIUS - d) / d) * REPEL_STRENGTH * dt * 60;
      const pushWX = dx * push;
      positions[ix] += pushWX * cos; // local x
      positions[iy] += dy * push; // local y (unaffected by Y rotation)
      positions[iz] += pushWX * sin; // local z
    }
  }

  pointsGeometry.attributes.position.needsUpdate = true;
  rebuildLines(field);
}

// The animated scene (must live inside <Canvas> to use R3F hooks). Buffers live
// in a ref and are only ever touched inside effects/frame callbacks — never read
// or mutated during render — which keeps the imperative R3F loop off the React
// render path. The <points>/<lineSegments> are created imperatively and added to
// the group so the geometries never have to be read during render.
function Constellation({ prefersReduced }) {
  const groupRef = useRef(null);
  const fieldRef = useRef(null);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const group = groupRef.current;
    const field = createField();
    fieldRef.current = field;

    const pointsMaterial = new THREE.PointsMaterial({
      color: TEAL,
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const linesMaterial = new THREE.LineBasicMaterial({
      color: TEAL,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const points = new THREE.Points(field.pointsGeometry, pointsMaterial);
    const lines = new THREE.LineSegments(field.lineGeometry, linesMaterial);
    group.add(points, lines);

    // Initial frame (also the single static frame for reduced motion)
    rebuildLines(field);
    field.pointsGeometry.attributes.position.needsUpdate = true;
    invalidate();

    return () => {
      group.remove(points, lines);
      pointsMaterial.dispose();
      linesMaterial.dispose();
      field.pointsGeometry.dispose();
      field.lineGeometry.dispose();
      fieldRef.current = null;
    };
  }, [invalidate]);

  useFrame((state, delta) => {
    if (prefersReduced) return; // static field — no drift/rotation/repel
    const field = fieldRef.current;
    if (!field) return;
    const dt = Math.min(delta, 0.05); // clamp to avoid jumps after a stall
    stepField(field, groupRef.current, state.pointer, state.viewport, dt);
  });

  return <group ref={groupRef} />;
}

// Default export — full-bleed background canvas behind the hero content.
// `active` (hero in view) pauses the render loop when false. Reduced motion
// renders a single static frame.
export default function ParticleConstellation({ active = true }) {
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  // Freeze (single static frame) when reduced motion is requested or the hero is
  // off-screen; otherwise run continuously.
  const frameloop = prefersReduced || !active ? "demand" : "always";

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Constellation prefersReduced={prefersReduced} />
      </Canvas>
    </div>
  );
}

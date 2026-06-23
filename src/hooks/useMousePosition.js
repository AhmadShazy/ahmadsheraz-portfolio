"use client";

import { useRef, useEffect } from "react";

// Tracks the mouse position normalized to the range -1..1 relative to the
// viewport center: x is -1 (left) .. 1 (right), y is -1 (bottom) .. 1 (top).
//
// Returns a ref ({ current: { x, y } }) that is updated in place on mousemove.
// Using a ref instead of state is deliberate: the 3D components read the value
// inside useFrame, so we must NOT trigger a React re-render on every pointer
// move (that would thrash the whole Three.js scene 60+ times a second).
//
// Pass `enabled = false` (e.g. on mobile, where there is no cursor) to skip
// attaching the listener entirely; the value resets to the origin so consumers
// that ease toward it settle back to center.
export default function useMousePosition(enabled = true) {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      mouse.current.x = 0;
      mouse.current.y = 0;
      return;
    }

    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enabled]);

  return mouse;
}

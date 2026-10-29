"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 36;
const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [tabindex]:not([tabindex="-1"])';

/**
 * Tech-style target reticle: a centre dot framed by four corner brackets.
 * The dot tracks the pointer exactly; the brackets follow with a spring.
 * Only mounts on devices with a fine pointer and hover (never on touch).
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false); // over an interactive element
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 450, damping: 36, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 450, damping: 36, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setActive(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const color = active ? "#15803d" : "#9a7424";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]" style={{ opacity: visible ? 1 : 0 }}>
      {/* corner brackets (spring-follow) */}
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy }}>
        <motion.svg
          width={SIZE}
          height={SIZE}
          viewBox="0 0 36 36"
          className="absolute"
          style={{ left: -SIZE / 2, top: -SIZE / 2, color, filter: `drop-shadow(0 0 ${active ? 6 : 2}px ${color})` }}
          animate={{ scale: pressed ? 0.8 : active ? 1.5 : 1, rotate: active ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <path d="M2 11 V2 H11" />
            <path d="M25 2 H34 V11" />
            <path d="M34 25 V34 H25" />
            <path d="M11 34 H2 V25" />
          </g>
        </motion.svg>
      </motion.div>

      {/* centre dot (exact) */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="absolute block rounded-full"
          style={{ left: -3, top: -3, width: 6, height: 6, background: active ? "#15803d" : "rgb(var(--ink))", boxShadow: `0 0 8px ${color}` }}
          animate={{ scale: pressed ? 0.6 : active ? 1.4 : 1 }}
        />
      </motion.div>
    </div>
  );
}

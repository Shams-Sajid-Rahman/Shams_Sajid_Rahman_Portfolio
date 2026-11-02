"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SIZE = 36; // reticle size when free-floating
const PAD = 6; // gap between a hovered element and the brackets wrapped around it
const CORNER = 10; // length of each bracket arm
// Elements bigger than this are not wrapped (e.g. whole cards); the reticle just lights up instead.
const MAX_W = 520;
const MAX_H = 220;
const INTERACTIVE =
  'a, button, input, textarea, select, label, summary, [role="button"], [role="tab"], [tabindex]:not([tabindex="-1"])';

const SPRING = { stiffness: 420, damping: 34, mass: 0.5 };

/**
 * Tech-style target reticle: a centre dot framed by four corner brackets.
 * Over a button or link the brackets snap out and wrap the whole element; elsewhere they
 * follow the pointer with a spring. Only mounts on devices with a fine pointer and hover.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false); // over an interactive element
  const [wrapped, setWrapped] = useState(false); // brackets are wrapped around that element
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  // pointer (centre dot)
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // bracket box: top-left corner + size, each sprung so it glides between pointer and targets
  const bx = useSpring(-100, SPRING);
  const by = useSpring(-100, SPRING);
  const bw = useSpring(SIZE, SPRING);
  const bh = useSpring(SIZE, SPRING);

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

    let target: Element | null = null;
    let px = -100;
    let py = -100;
    let raf = 0;

    // Every frame: wrap the hovered element (re-measured, so it stays locked on while scrolling),
    // or centre the reticle on the pointer.
    const tick = () => {
      const r = target?.getBoundingClientRect();
      if (r && r.width <= MAX_W && r.height <= MAX_H) {
        bx.set(r.left - PAD);
        by.set(r.top - PAD);
        bw.set(r.width + PAD * 2);
        bh.set(r.height + PAD * 2);
      } else {
        const s = target ? SIZE * 1.4 : SIZE;
        bx.set(px - s / 2);
        by.set(py - s / 2);
        bw.set(s);
        bh.set(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const retarget = (el: Element | null) => {
      target = el?.closest?.(INTERACTIVE) ?? null;
      const r = target?.getBoundingClientRect();
      setActive(!!target);
      setWrapped(!!r && r.width <= MAX_W && r.height <= MAX_H);
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      x.set(px);
      y.set(py);
      setVisible(true);
      retarget(e.target as Element | null);
    };
    // Scrolling moves elements under a still pointer, so look again instead of staying stuck on the old one.
    const onScroll = () => retarget(document.elementFromPoint(px, py));
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => {
      setVisible(false);
      target = null;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, bx, by, bw, bh]);

  if (!enabled) return null;

  const color = active ? "rgb(var(--accent))" : "rgb(var(--gold))";
  const arm = `absolute block border-current`;
  const thick = wrapped ? 3 : 2;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]" style={{ opacity: visible ? 1 : 0 }}>
      {/* corner brackets: a box that either follows the pointer or wraps the hovered element */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: bx, y: by, width: bw, height: bh, color, filter: `drop-shadow(0 0 ${active ? 6 : 2}px ${color})` }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: pressed ? 0.92 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
          <span className={`${arm} left-0 top-0`} style={{ width: CORNER, height: CORNER, borderTopWidth: thick, borderLeftWidth: thick }} />
          <span className={`${arm} right-0 top-0`} style={{ width: CORNER, height: CORNER, borderTopWidth: thick, borderRightWidth: thick }} />
          <span className={`${arm} bottom-0 right-0`} style={{ width: CORNER, height: CORNER, borderBottomWidth: thick, borderRightWidth: thick }} />
          <span className={`${arm} bottom-0 left-0`} style={{ width: CORNER, height: CORNER, borderBottomWidth: thick, borderLeftWidth: thick }} />
        </motion.div>
      </motion.div>

      {/* centre dot (exact) */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="absolute block rounded-full"
          style={{ left: -3, top: -3, width: 6, height: 6, background: active ? color : "rgb(var(--ink))", boxShadow: `0 0 8px ${color}` }}
          animate={{ scale: pressed ? 0.6 : active ? 1.2 : 1 }}
        />
      </motion.div>
    </div>
  );
}

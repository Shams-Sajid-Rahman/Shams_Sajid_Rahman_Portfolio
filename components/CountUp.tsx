"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

type Props = { value: number; decimals?: number; delay?: number; duration?: number };

/** Counts from 0 up to `value` once per page load, starting when the number scrolls into view. */
export default function CountUp({ value, decimals = 0, delay = 0.5, duration = 1.8 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  const format = (v: number) =>
    v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      delay,
      duration,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
    // format only depends on decimals
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, decimals, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(0)}
    </span>
  );
}

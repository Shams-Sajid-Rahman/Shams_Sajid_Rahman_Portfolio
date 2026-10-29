"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TITLES = [
  "AI/ML Researcher",
  "Medical Imaging & Generative Models",
  "Full-Stack Developer",
  "General Secretary @NSU ACM Student Chapter",
  "CSE Graduate @NSU",
];

/** Cycles through the titles one by one: the old one fades out, the next fades in. */
export default function RotatingTitle({ className = "" }: { className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % TITLES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`relative min-h-[2.75rem] ${className}`}>
      {/* the animated text is decorative; screen readers get the full list once */}
      <span className="sr-only">{TITLES.join(", ")}</span>
      <AnimatePresence mode="wait">
        <motion.p
          key={TITLES[i]}
          aria-hidden="true"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="font-mono text-sm font-medium leading-snug text-matrix"
        >
          <span className="text-muted">&gt; </span>
          {TITLES[i]}
          <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-matrix" />
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

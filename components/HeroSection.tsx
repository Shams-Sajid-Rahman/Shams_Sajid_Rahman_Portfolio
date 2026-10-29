"use client";

import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, GraduationCap, Github, Users } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import { PROFILE } from "@/lib/profile";
import NeuralNetDiagram from "./NeuralNetDiagram";
import RotatingTitle from "./RotatingTitle";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const STATS = [
  { icon: GraduationCap, text: "CGPA 3.35 / 4.00 · NSU" },
  { icon: Users, text: "4 yrs · NSU ACM" },
];

const pillDark =
  "inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-matrix hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix";
const pillLight =
  "inline-flex items-center gap-2 rounded-full border border-ink/20 bg-panel px-5 py-3 text-sm font-medium text-ink transition hover:border-matrix hover:bg-matrix hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix";

export default function HeroSection() {
  const toContact = (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("contact");
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="section flex min-h-[calc(100vh-4rem)] items-center py-8 sm:py-12 lg:py-12">
      <div className="grid w-full overflow-hidden hero-frame rounded-[2rem] border-2 md:grid-cols-[1.05fr_0.95fr]">
        {/* ---------- Left: bold type ---------- */}
        <div className="flex flex-col justify-center hero-right p-7 sm:p-10 lg:p-14">
          <motion.p {...fadeUp(0)} className="section-label">
            &gt; {PROFILE.name.toLowerCase().replace(/ /g, "_")}
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-4 text-[2rem] font-black uppercase leading-[1.04] tracking-tight text-ink sm:text-5xl xl:text-6xl"
          >
            Engaging Intelligence to Architect <span className="text-outline">What&apos;s Next.</span>
          </motion.h1>

          <motion.div {...fadeUp(0.22)} className="mt-5">
            <p className="max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Computer Science &amp; Engineering graduate building at the frontier of AI &amp; software.
            </p>
            <RotatingTitle className="mt-3" />
          </motion.div>

          <motion.ul {...fadeUp(0.3)} className="mt-2 flex flex-wrap gap-2" aria-label="Highlights">
            {STATS.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="inline-flex items-center gap-1.5 rounded-full border border-glass bg-panel px-3 py-1.5 font-mono text-[11px] text-ink shadow-sm"
              >
                <Icon size={12} className="text-matrix" /> {text}
              </li>
            ))}
          </motion.ul>

          <motion.div {...fadeUp(0.4)} className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#contact" onClick={toContact} className={pillDark}>
              Get in touch <ArrowRight size={16} />
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className={pillLight}>
              <Github size={16} /> GitHub
            </a>
            <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer" className={pillLight}>
              <FileText size={16} /> View CV
            </a>
          </motion.div>
        </div>

        {/* ---------- Right: animated 3D neural network spinning 360° (forward pass + backpropagation) ---------- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative isolate min-h-[24rem] overflow-hidden hero-left md:min-h-[34rem]"
        >
          {/* faint halftone dots for texture */}
          <div aria-hidden="true" className="hero-dots absolute inset-0 -z-10 opacity-50" />
          <NeuralNetDiagram />
        </motion.div>
      </div>
    </section>
  );
}

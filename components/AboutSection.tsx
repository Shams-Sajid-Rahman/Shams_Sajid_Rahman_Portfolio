"use client";

import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { Download } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import Portrait from "./Portrait";

// Deterministic pseudo-random bits (same on server and client, so no hydration mismatch).
const BINARY = (() => {
  let seed = 20260101;
  const lines: string[] = [];
  for (let i = 0; i < 40; i++) {
    let line = "";
    for (let j = 0; j < 160; j++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      line += (seed >>> 16) & 1 ? "1" : "0";
    }
    lines.push(line);
  }
  return lines.join("\n");
})();

const TAGS = [
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Medical Imaging",
  "Diffusion Models",
  "Full-Stack Development",
];

export default function AboutSection() {
  return (
    <section id="about" className="section grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="backdrop-full hidden dark:block" aria-hidden="true">
        <div className="about-glow absolute inset-0" />
        <pre className="about-binary absolute inset-0 overflow-hidden pt-6">{BINARY}</pre>
      </div>
      <motion.div
        {...slideIn("left")}
        className="glass-card relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden px-3 pt-3"
      >
        {/* colourful glow behind the cut-out, so the figure stands out from the card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 42%, rgb(var(--accent) / 0.45), transparent 70%), radial-gradient(ellipse 60% 45% at 75% 85%, rgb(var(--accent2) / 0.35), transparent 70%)",
          }}
        />
        <Portrait
          src={PROFILE.photoCutout}
          fit="contain"
          grayscale={false}
          className="h-full w-full object-bottom text-6xl drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
        />
      </motion.div>

      <motion.div {...slideIn("right", 0.1)}>
        <p className="section-label">&gt; who_am_i</p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-outline">ABOUT</span>
        </h2>

        <div className="mt-6 space-y-4 text-ink dark:text-[#ffffff]">
          <p>
            I&apos;m a Computer Science &amp; Engineering graduate from North South University with a focus on
            machine learning, deep learning, natural language processing, and full-stack software
            engineering. Experienced in designing and implementing AI-powered applications, multi-model
            regression systems, and scalable frontend and backend APIs.
          </p>
          <p>
            I contributed to work published in IEEE QPAIN 2026 on Multi-Source Alzheimer&apos;s Disease Classification, and
            I&apos;m currently working on text-to-medical-video generation using diffusion models and LoRA
            fine-tuning.
          </p>
          <p>
            Currently seeking AI/ML and software engineering opportunities where I can contribute to
            meaningful products and grow alongside a strong team.
          </p>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Core focus areas">
          {TAGS.map((t) => (
            <li
              key={t}
              className="rounded-full border border-glass bg-glass px-3 py-1 font-mono text-xs text-ink backdrop-blur-md dark:text-[#ffffff]"
            >
              {t}
            </li>
          ))}
        </ul>

        <a
          href={PROFILE.resume}
          download
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-matrix hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <Download size={16} /> Download Resume
        </a>
      </motion.div>
    </section>
  );
}

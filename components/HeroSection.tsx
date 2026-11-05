"use client";

import { Fragment, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { getLenis } from "@/lib/lenis";
import { PROFILE } from "@/lib/profile";
import CountUp from "./CountUp";
import NeuralNetDiagram from "./NeuralNetDiagram";
import RotatingTitle from "./RotatingTitle";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const ROLES = ["AI/ML Researcher", "Full-Stack Developer", "CSE Graduate @NSU"];
const PIPELINE = ["Data", "Preprocess", "Train", "Evaluate", "Publish"];
const STATS = [
  { label: "CGPA, North South University", value: 3.35, decimals: 2, suffix: "/4.00" },
  { label: "IEEE publication", value: 1 },
  { label: "Software Projects Built", value: 20 },
  { label: "Research Projects", value: 2 },
  { label: "NSU ACM experience", value: 4, suffix: " yrs" },
];

const SOCIALS = [
  { label: "LinkedIn", href: PROFILE.linkedin, icon: Linkedin },
  { label: "GitHub", href: PROFILE.github, icon: Github },
  { label: "Email", href: `mailto:${PROFILE.email}`, icon: Mail },
];

const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix";
const btnSolid = `inline-flex items-center gap-2 rounded-xl bg-matrix px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 ${focusRing}`;
const btnOutline = `inline-flex items-center gap-2 rounded-xl border border-ink/20 bg-panel px-6 py-3 text-sm font-medium text-ink transition hover:border-matrix hover:bg-matrix hover:text-white ${focusRing}`;
const btnIcon = `flex h-11 w-11 items-center justify-center rounded-xl border border-ink/20 bg-panel text-ink transition hover:border-matrix hover:bg-matrix hover:text-white ${focusRing}`;

export default function HeroSection() {
  const toProjects = (e: MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("projects");
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="hero" className="section flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-10 !py-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---------- Left: name, role, actions ---------- */}
        <div className="min-w-0">
          <motion.p {...fadeUp(0)} className="section-label !text-xs">
            Computer Science &amp; Engineering Graduate
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl xl:text-7xl"
          >
            {PROFILE.name}
          </motion.h1>

          <motion.div {...fadeUp(0.2)} className="mt-4">
            <RotatingTitle />
          </motion.div>

          <motion.ul {...fadeUp(0.28)} className="mt-1 flex flex-wrap gap-2" aria-label="Roles">
            {ROLES.map((text) => (
              <li
                key={text}
                className="rounded-full border border-glass bg-panel px-3 py-1.5 text-xs font-medium text-ink shadow-sm"
              >
                {text}
              </li>
            ))}
          </motion.ul>

          <motion.p {...fadeUp(0.34)} className="mt-5 max-w-xl leading-relaxed text-ink/80">
            Building at the frontier of AI &amp; software, from medical imaging research and text-to-video
            diffusion models to scalable frontend &amp; backend APIs.
          </motion.p>

          <motion.div {...fadeUp(0.4)} className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#projects" onClick={toProjects} className={btnSolid}>
              Explore Portfolio <ArrowDown size={16} />
            </a>
            <a href={PROFILE.resume} download className={btnOutline}>
              <Download size={16} /> Download Resume
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.46)} className="mt-6 flex flex-wrap items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className={btnIcon}
              >
                <Icon size={18} />
              </a>
            ))}
            <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-ink/80">
              <MapPin size={15} className="text-matrix" /> {PROFILE.city}
            </span>
          </motion.div>
        </div>

        {/* ---------- Right: model viewer card ---------- */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card min-w-0 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-matrix">Model://Neural-Net</span>
            <span aria-hidden="true" className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          </div>

          <div className="relative mt-3 h-[20rem] sm:h-[24rem]">
            <NeuralNetDiagram />
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            Drag to move · Double-click to reset
          </p>

          <div className="mt-4 border-t border-glass pt-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Research pipeline</p>
            <ul className="mt-2 flex flex-wrap items-center gap-1.5">
              {PIPELINE.map((step, i) => (
                <Fragment key={step}>
                  {i > 0 && <ArrowRight aria-hidden="true" size={12} className="text-muted" />}
                  <li className="rounded border border-matrix/40 bg-matrix/10 px-2 py-1 font-mono text-xs text-matrix">
                    {step}
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* ---------- Stats strip ---------- */}
      <motion.dl
        {...fadeUp(0.5)}
        className="glass-card grid grid-cols-2 divide-glass overflow-hidden md:grid-cols-3 lg:grid-cols-5 lg:divide-x"
      >
        {STATS.map(({ label, value, decimals, suffix }) => (
          <div key={label} className="min-w-0 p-5">
            <dt className="text-xs text-ink/80">{label}</dt>
            <dd className="mt-1 text-3xl font-bold tracking-tight text-ink">
              <CountUp value={value} decimals={decimals} />
              {suffix && <span className="text-lg text-matrix">{suffix}</span>}
            </dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}

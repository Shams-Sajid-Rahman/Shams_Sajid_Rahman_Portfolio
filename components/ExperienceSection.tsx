"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { BadgeCheck, BookOpenText, Bot, ExternalLink, GitBranch, Layers, MapPin, type LucideIcon } from "lucide-react";

type Category = "AI Engineering" | "Research" | "Open Source";
type Filter = "All" | Category;

type Job = {
  role: string;
  org: string;
  orgUrl?: string;
  period: string;
  place?: string;
  category: Category;
  bullets: string[];
  stack: string[];
  certId?: string;
};

const JOBS: Job[] = [
  {
    role: "Machine Learning Intern",
    org: "FlyRank AI",
    orgUrl: "https://flyrank.ai",
    period: "July 2026 – September 2026",
    place: "Remote",
    category: "AI Engineering",
    bullets: [
      "Completed a structured Machine Learning Internship Program at FlyRank Corp., applying practical ML skills through hands-on assignments and a capstone project reviewed and accepted by the team.",
      "Demonstrated excellence in technical competency, professional conduct, and collaborative contribution to the FlyRank AI team.",
    ],
    stack: [],
    certId: "FR-D11-AF08E-4D5DE",
  },
];

const ICONS: Record<Filter, LucideIcon> = {
  All: Layers,
  "AI Engineering": Bot,
  Research: BookOpenText,
  "Open Source": GitBranch,
};

export default function ExperienceSection() {
  const [filter, setFilter] = useState<Filter>("All");
  const categories = Array.from(new Set(JOBS.map((j) => j.category)));
  const filters: Filter[] = ["All", ...categories];
  const showTabs = categories.length > 1; // a single category makes the filter pointless
  const jobs = JOBS.filter((j) => filter === "All" || j.category === filter);

  return (
    <section id="experience" className="section">
      <motion.div
        {...slideIn("right")}
      >
        <p className="section-label">&gt; career.log</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">EXPERIENCE</h2>
      </motion.div>

      <div className={`mt-10 grid gap-8 ${showTabs ? "lg:grid-cols-[14rem_minmax(0,1fr)]" : ""}`}>
        {showTabs && (
          <div
            role="tablist"
            aria-label="Filter experience by role type"
            className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible"
          >
            {filters.map((label) => {
              const Icon = ICONS[label];
              const on = filter === label;
              return (
                <button
                  key={label}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(label)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-matrix ${
                    on
                      ? "border-matrix bg-matrix text-white shadow-glow"
                      : "border-glass bg-glass text-muted hover:border-matrix hover:bg-matrix hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-[11px] top-2 w-px bg-gradient-to-b from-matrix via-matrix/40 to-transparent shadow-glow"
          />
          <ul className="space-y-8">
            <AnimatePresence mode="popLayout">
              {jobs.map((job, idx) => (
                <motion.li
                  key={job.org + job.role}
                  layout
                  initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative pl-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-matrix bg-sage shadow-glow"
                  >
                    <span className="h-2 w-2 rounded-full bg-matrix" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-[35px] h-px w-4 bg-matrix shadow-glow"
                  />

                  <article className="glass-card p-5 transition hover:border-matrix/40">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {job.role} <span className="text-muted">at</span>{" "}
                          {job.orgUrl ? (
                            <a
                              href={job.orgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-gold hover:underline"
                            >
                              {job.org} <ExternalLink size={13} />
                            </a>
                          ) : (
                            <span className="text-gold">{job.org}</span>
                          )}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-muted">
                          {job.place && (
                            <>
                              <MapPin size={12} /> {job.place} ·{" "}
                            </>
                          )}
                          {job.category}
                        </p>
                      </div>
                      <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
                        {job.period}
                      </span>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm text-muted">
                      {job.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-matrix" />
                          {b}
                        </li>
                      ))}
                    </ul>

                    {job.certId && (
                      <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix">
                        <BadgeCheck size={13} /> Certificate ID: {job.certId}
                      </p>
                    )}

                    {job.stack.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                        {job.stack.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </section>
  );
}

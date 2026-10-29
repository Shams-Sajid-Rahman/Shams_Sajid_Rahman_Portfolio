"use client";

import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { PROFILE } from "@/lib/profile";

type Paper = {
  title: string;
  venue: string;
  venueNote: string;
  year: string;
  doi: string;
  abstract: string;
};

const PAPERS: Paper[] = [
  {
    title: "Accuracy-Robustness Tradeoff in Multi-Source Alzheimer's Disease Classification",
    venue: "IEEE",
    venueNote: "Published in IEEE QPAIN 2026, Chittagong, Bangladesh. IEEE Xplore.",
    year: "2026",
    doi: "10.1109/QPAIN69676.2026.11546348",
    abstract:
      "Presents a systematic evaluation of accuracy vs. robustness tradeoffs in cross-source medical AI classification, revealing critical failure modes in lab-accurate deep learning systems when deployed clinically.",
  },
];

const btn =
  "inline-flex items-center gap-2 rounded-lg border border-gold px-3.5 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function PublicationsSection() {
  return (
    <section id="publications" className="section">
      <motion.div
        {...slideIn("left")}
      >
        <p className="section-label">&gt; papers.bib</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">PUBLICATIONS</h2>
      </motion.div>

      <ul className="mt-10 space-y-4">
        {PAPERS.map((p, i) => (
          <motion.li
            key={p.doi}
            {...slideIn(i % 2 === 0 ? "right" : "left", 0.08 * i)}
            className="glass-card flex flex-col gap-4 p-5 transition duration-300 hover:border-matrix/50 hover:shadow-[0_0_28px_rgb(var(--accent)/0.12)] md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix">
                  {p.venue}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                  <CalendarDays size={13} /> {p.year}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                  <MapPin size={13} /> Chittagong, Bangladesh
                </span>
              </div>
              <h3 className="mt-2 text-base font-semibold sm:text-lg">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.abstract}</p>
              <p className="mt-1 text-sm text-muted">{p.venueNote}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                DOI: <span className="text-ink/80">{p.doi}</span>
              </p>
            </div>

            <div className="shrink-0">
              <a href={PROFILE.paperUrl} target="_blank" rel="noopener noreferrer" className={btn}>
                <ExternalLink size={15} /> Read on IEEE Xplore
              </a>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { Clapperboard, GraduationCap, HeartPulse, type LucideIcon } from "lucide-react";

type Layer = { name: string; sub: string; w: number; h: number; key?: boolean };

type Research = {
  title: string;
  affiliation: string;
  year: string;
  text: string;
  icon: LucideIcon;
  stats: string[];
  viewer: string;
  layers: Layer[];
};

const RESEARCH: Research[] = [
  {
    title: "Accuracy-Robustness Tradeoff in Multi-Source Alzheimer's Disease Classification",
    affiliation: "North South University",
    year: "2025",
    text: "Benchmarked 5 deep learning architectures (ResNet-18, MobileNet-V3, NeuroFusion, DeepCNN-SE-CBAM, SKTripletFusion) across 89,955 MRI images from 3 independent datasets (Kaggle, OASIS, ADNI) to quantify accuracy-robustness tradeoffs under cross-source domain shift. DeepCNN-SE-CBAM, with dual-attention mechanisms, achieved 91% real-world robustness, outperforming 99%+ lab-accuracy models that collapsed under clinical noise conditions.",
    icon: HeartPulse,
    stats: ["89,955 MRI images", "3 datasets", "91% robustness"],
    viewer: "DeepCNN-SE-CBAM",
    layers: [
      { name: "MRI", sub: "input", w: 10, h: 120 },
      { name: "Conv", sub: "block 1", w: 22, h: 108 },
      { name: "Conv", sub: "block 2", w: 28, h: 88 },
      { name: "SE", sub: "channel", w: 16, h: 72, key: true },
      { name: "CBAM", sub: "attention", w: 20, h: 72, key: true },
      { name: "Conv", sub: "block 3", w: 34, h: 56 },
      { name: "Dense", sub: "head", w: 12, h: 80 },
      { name: "Class", sub: "output", w: 10, h: 40 },
    ],
  },
  {
    title: "MedT2V: Text-to-Medical Video Generation Framework",
    affiliation: "North South University",
    year: "2026",
    text: "End-to-end text-to-video pipeline trained on 55,000 medical video-caption pairs using LoRA fine-tuning of the Wan2.1-T2V-1.3B diffusion model. Engineered Pyramidal Pseudo-Mamba Encoding (PME) and Direction-Aware Fusion (DAF) for multi-scale temporal modeling and enhanced text-video semantic alignment.",
    icon: Clapperboard,
    stats: ["55,000 pairs", "Wan2.1-T2V-1.3B", "LoRA"],
    viewer: "MedT2V pipeline",
    layers: [
      { name: "Text", sub: "prompt", w: 10, h: 40 },
      { name: "Encoder", sub: "text", w: 24, h: 76 },
      { name: "PME", sub: "pyramidal", w: 22, h: 96, key: true },
      { name: "DAF", sub: "fusion", w: 22, h: 96, key: true },
      { name: "Diffusion", sub: "Wan2.1 + LoRA", w: 40, h: 110, key: true },
      { name: "Decoder", sub: "latent→pixel", w: 24, h: 80 },
      { name: "Video", sub: "output", w: 10, h: 120 },
    ],
  },
];

function TopologyViewer({ layers }: { layers: Layer[] }) {
  const gap = 28;
  const total = layers.reduce((s, l) => s + l.w, 0) + gap * (layers.length - 1);
  let x = (460 - total) / 2;
  const placed = layers.map((l) => {
    const p = { ...l, x };
    x += l.w + gap;
    return p;
  });

  return (
    <svg viewBox="0 0 460 260" className="h-auto w-full text-ink" role="img" aria-label="Model topology diagram">
      <defs>
        <marker id="topoArr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#15803d" fillOpacity="0.6" />
        </marker>
      </defs>
      {placed.map((l, i) => {
        const next = placed[i + 1];
        const col = l.key ? "#15803d" : "#9a7424";
        const y = 120 - l.h / 2;
        const d = 8; // depth offset for pseudo-3D
        return (
          <g key={`${l.name}-${i}`}>
            {next && (
              <line
                x1={l.x + l.w + d}
                y1={120}
                x2={next.x}
                y2={120}
                stroke="#15803d"
                strokeOpacity="0.55"
                strokeDasharray="3 3"
                markerEnd="url(#topoArr)"
              />
            )}
            <rect x={l.x + d} y={y - d} width={l.w} height={l.h} fill={col} fillOpacity="0.06" stroke={col} strokeOpacity="0.4" />
            <rect
              x={l.x}
              y={y}
              width={l.w}
              height={l.h}
              fill={col}
              fillOpacity={l.key ? 0.3 : 0.14}
              stroke={col}
              strokeOpacity="0.9"
              style={l.key ? { filter: "drop-shadow(0 0 6px rgba(22,163,74,.6))" } : undefined}
            />
            <polyline
              points={`${l.x},${y} ${l.x + d},${y - d} ${l.x + l.w + d},${y - d} ${l.x + l.w},${y}`}
              fill="none"
              stroke={col}
              strokeOpacity="0.5"
            />
            <text x={l.x + l.w / 2 + d / 2} y="214" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill={l.key ? "#16a34a" : "currentColor"}>
              {l.name}
            </text>
            <text x={l.x + l.w / 2 + d / 2} y="226" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#4b5563">
              {l.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ResearchSection() {
  const [sel, setSel] = useState(0);
  const current = RESEARCH[sel];

  return (
    <section id="research" className="section">
      <motion.div
        {...slideIn("right")}
      >
        <p className="section-label">&gt; research.focus</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">RESEARCH</h2>
      </motion.div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <motion.div
          {...slideIn("left")}
          className="glass-card p-5 lg:sticky lg:top-24"
        >
          <div className="mb-3 flex items-center justify-between gap-2 font-mono text-xs text-muted">
            <span>
              <span className="text-matrix">●</span> model_topology.viewer
            </span>
            <span className="text-gold">{current.viewer}</span>
          </div>
          <div className="rounded-lg border border-glass bg-panel p-3">
            <TopologyViewer layers={current.layers} />
          </div>
          <p className="mt-3 text-center font-mono text-xs text-muted">schematic illustration · select a paper to switch the view</p>
        </motion.div>

        <div className="space-y-4">
          {RESEARCH.map(({ title, affiliation, year, text, icon: Icon, stats }, i) => {
            const on = sel === i;
            return (
              <motion.article
                key={title}
                tabIndex={0}
                onPointerEnter={() => setSel(i)}
                onFocus={() => setSel(i)}
                onClick={() => setSel(i)}
                {...slideIn(i % 2 === 0 ? "right" : "left", 0.1 * i)}
                className={`glass-card cursor-pointer p-5 outline-none transition duration-300 hover:border-matrix/60 focus-visible:border-matrix/60 ${
                  on ? "border-matrix/50 shadow-[0_0_28px_rgb(var(--accent)/0.15)]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border border-gold/40 bg-gold/10 p-2.5 text-gold">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-gold">
                      <GraduationCap size={13} /> {affiliation} ({year})
                    </p>
                    <p className="mt-3 text-sm text-muted">{text}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {stats.map((s) => (
                        <li
                          key={s}
                          className="rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

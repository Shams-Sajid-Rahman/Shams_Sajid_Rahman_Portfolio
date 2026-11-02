"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import CountUp from "./CountUp";
import { Braces, Brain, Database, FlaskConical, Layers, type LucideIcon } from "lucide-react";

type Category = { name: string; short: string; icon: LucideIcon; rgb: string; skills: string[] };

const CATEGORIES: Category[] = [
  {
    name: "ML & AI",
    short: "ML & AI",
    rgb: "22,163,74",
    icon: Brain,
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "OpenCV",
      "Hugging Face (Transformers & Diffusers)",
      "PEFT & LoRA",
      "LangChain",
      "Google Gemini API",
      "CBAM",
      "MC-Dropout",
    ],
  },
  {
    name: "Languages",
    short: "Languages",
    rgb: "37,99,235",
    icon: Braces,
    skills: ["Python", "C", "C++", "Java", "JavaScript", "Dart", "SQL", "HTML5", "CSS3"],
  },
  {
    name: "Backend & Frontend",
    short: "Back/Front",
    rgb: "124,58,237",
    icon: Layers,
    skills: [
      "React.js",
      "Node.js",
      "Express.js",
      "RESTful API Design",
      "MVC Architecture",
      "Flutter (Dart)",
      "EJS",
    ],
  },
  {
    name: "Databases & Tools",
    short: "DB & Tools",
    rgb: "234,138,6",
    icon: Database,
    skills: [
      "PostgreSQL",
      "MySQL",
      "Firebase Realtime DB",
      "MongoDB",
      "Git & GitHub",
      "Jupyter Notebook",
      "Google Colab",
      "VS Code",
    ],
  },
  {
    name: "Data Science",
    short: "Data Sci",
    rgb: "225,29,72",
    icon: FlaskConical,
    skills: [
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "GridSearchCV",
      "Cross-Validation",
      "Model Evaluation Metrics",
    ],
  },
];

// Figures taken from the research and project write-ups.
const DEEP_LEARNING = [
  { label: "MRI images benchmarked", value: 89955 },
  { label: "Architectures compared", value: 5 },
  { label: "Real-world robustness (DeepCNN-SE-CBAM)", value: 91, suffix: "%" },
  { label: "Video-caption pairs (MedT2V)", value: 55000 },
];

const ENGINEERING = [
  { label: "REST endpoints (RBAC API)", value: 55, suffix: "+" },
  { label: "API modules", value: 9 },
  { label: "Automated Jest/Supertest tests", value: 69 },
  { label: "Regression algorithms benchmarked", value: 6 },
];

function StatRow({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="group flex items-baseline justify-between gap-4 border-b border-glass pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-muted transition group-hover:text-ink">{label}</span>
      <span className="font-mono text-lg font-bold text-gold transition group-hover:text-matrix group-hover:drop-shadow-[0_0_8px_rgba(22,163,74,0.6)]">
        <CountUp value={value} delay={0.2} />
        {suffix}
      </span>
    </div>
  );
}

/* ---------- Isometric wireframe block chart ---------- */
const COLS = 3;
const CELL = 44; // footprint edge length
const GAP = CELL * 1.9; // centre-to-centre spacing, leaves clear floor between blocks
const MIN_H = 36;
const MAX_H = 130;
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const PAD = 22;
const MAX_COUNT = Math.max(...CATEGORIES.map((c) => c.skills.length));
const GREEN = "#15803d";

function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}
const pts = (...p: [number, number][]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

const ROWS = Math.ceil(CATEGORIES.length / COLS);
// Footprint origin of every block, centred on the floor.
const blocks = CATEGORIES.map((c, n) => {
  const col = n % COLS;
  const row = Math.floor(n / COLS);
  const x = (col - (COLS - 1) / 2) * GAP - CELL / 2;
  const y = (row - (ROWS - 1) / 2) * GAP - CELL / 2;
  const h = MIN_H + ((c.skills.length - 1) / (MAX_COUNT - 1)) * (MAX_H - MIN_H);
  return { ...c, n, col, row, x, y, h };
});
const FLOOR = { x0: -((COLS - 1) / 2) * GAP - CELL - 14, x1: ((COLS - 1) / 2) * GAP + CELL + 14, y0: -((ROWS - 1) / 2) * GAP - CELL - 14, y1: ((ROWS - 1) / 2) * GAP + CELL + 14 };

// ViewBox is derived from the geometry, so nothing can be clipped at any block height.
const VIEW = (() => {
  const all: [number, number][] = [
    iso(FLOOR.x0, FLOOR.y0, 0), iso(FLOOR.x1, FLOOR.y0, 0), iso(FLOOR.x1, FLOOR.y1, 0), iso(FLOOR.x0, FLOOR.y1, 0),
  ];
  for (const b of blocks) {
    for (const [px, py] of [[0, 0], [CELL, 0], [CELL, CELL], [0, CELL]]) {
      all.push(iso(b.x + px, b.y + py, 0), iso(b.x + px, b.y + py, b.h));
    }
    all.push(iso(b.x + CELL / 2, b.y + CELL / 2, b.h + 34)); // label headroom
  }
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs) - PAD, x1 = Math.max(...xs) + PAD;
  const y0 = Math.min(...ys) - PAD, y1 = Math.max(...ys) + PAD;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
})();

function IsoChart({ hover, setHover }: { hover: number | null; setHover: (n: number | null) => void }) {
  // paint back-to-front
  const ordered = [...blocks].sort((a, b) => a.col + a.row - (b.col + b.row));
  const active = hover !== null ? CATEGORIES[hover] : null;
  const STEPS = 6;

  return (
    <div>
      <svg
        viewBox={`${VIEW.x.toFixed(1)} ${VIEW.y.toFixed(1)} ${VIEW.w.toFixed(1)} ${VIEW.h.toFixed(1)}`}
        className="mx-auto block h-auto w-full max-w-[460px] overflow-visible"
        role="img"
        aria-label="Isometric block chart of technical stack breadth by category"
        onPointerLeave={() => setHover(null)}
      >
        {/* floor plane + grid */}
        <polygon
          points={pts(iso(FLOOR.x0, FLOOR.y0, 0), iso(FLOOR.x1, FLOOR.y0, 0), iso(FLOOR.x1, FLOOR.y1, 0), iso(FLOOR.x0, FLOOR.y1, 0))}
          style={{ fill: "var(--panel)" }}
          stroke="rgba(21,128,61,0.45)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <g stroke="rgba(21,128,61,0.28)" strokeWidth="1" fill="none">
          {Array.from({ length: STEPS - 1 }, (_, i) => {
            const t = (i + 1) / STEPS;
            const gx = FLOOR.x0 + t * (FLOOR.x1 - FLOOR.x0);
            const gy = FLOOR.y0 + t * (FLOOR.y1 - FLOOR.y0);
            return (
              <g key={i}>
                <polyline points={pts(iso(gx, FLOOR.y0, 0), iso(gx, FLOOR.y1, 0))} />
                <polyline points={pts(iso(FLOOR.x0, gy, 0), iso(FLOOR.x1, gy, 0))} />
              </g>
            );
          })}
        </g>

        {ordered.map((b) => {
          const on = hover === b.n;
          const o = (px: number, py: number, pz: number) => iso(b.x + px, b.y + py, pz);
          const s = CELL;
          const top = [o(0, 0, b.h), o(s, 0, b.h), o(s, s, b.h), o(0, s, b.h)];
          const left = [o(0, s, 0), o(s, s, 0), o(s, s, b.h), o(0, s, b.h)];
          const right = [o(s, 0, 0), o(s, s, 0), o(s, s, b.h), o(s, 0, b.h)];
          const stroke = `rgb(${b.rgb})`;
          const [lx, ly] = o(s / 2, s / 2, b.h + 16);
          return (
            <g
              key={b.name}
              onPointerEnter={() => setHover(b.n)}
              onFocus={() => setHover(b.n)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              aria-label={`${b.name}: ${b.skills.length} technologies`}
              className="cursor-pointer outline-none"
              style={{ transition: "transform .25s", transform: on ? "translateY(-6px)" : "none" }}
            >
              <polygon points={pts(...left)} fill={`rgba(${b.rgb},${on ? 0.5 : 0.26})`} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
              <polygon points={pts(...right)} fill={`rgba(${b.rgb},${on ? 0.7 : 0.42})`} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
              <polygon points={pts(...top)} fill={`rgba(${b.rgb},${on ? 0.95 : 0.66})`} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                className="pointer-events-none select-none font-mono text-ink"
                fill="currentColor"
                style={{ stroke: "rgb(var(--sage))" }}
                strokeWidth="3.5"
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {b.short}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-3 h-5 text-center font-mono text-xs text-muted" aria-live="polite">
        {active ? (
          <>
            <span className="font-semibold text-matrix">{active.name}</span> · {active.skills.length} technologies
          </>
        ) : (
          "hover a block to inspect"
        )}
      </p>
    </div>
  );
}

export default function SkillsSection() {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="skills" className="section">
      <motion.div {...slideIn("left")}>
        <p className="section-label">&gt; tech_stack</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">SKILLS</h2>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Left: categorized skill pills */}
        <div className="space-y-4">
          {CATEGORIES.map(({ name, icon: Icon, skills, rgb }, n) => (
            <motion.div
              key={name}
              {...slideIn(n % 2 === 0 ? "right" : "left", 0.05 * n)}
              onPointerEnter={() => setHover(n)}
              onPointerLeave={() => setHover(null)}
              className={`glass-card p-4 transition duration-300 ${
                hover === n ? "border-matrix/60 shadow-glow" : ""
              }`}
            >
              <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold">
                <Icon size={14} style={{ color: `rgb(${rgb})` }} /> {name}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <li
                    key={s}
                    style={{ "--c": rgb.replace(/,/g, " ") } as React.CSSProperties}
                    className="max-w-full rounded-full border border-[rgb(var(--c)/0.4)] bg-[rgb(var(--c)/0.1)] px-2.5 py-1 font-mono text-[11px] text-ink/90 transition hover:border-[rgb(var(--c))] hover:bg-[rgb(var(--c))] hover:text-white"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Center: isometric chart */}
        <motion.div
          {...slideIn("left", 0.1)}
          className="glass-card self-start p-5 lg:sticky lg:top-24"
        >
          <h3 className="mb-2 font-mono text-sm uppercase tracking-widest text-gold">Stack Breadth</h3>
          <IsoChart hover={hover} setHover={setHover} />
        </motion.div>

        {/* Right: stat cards */}
        <div className="flex flex-col gap-6">
          {[
            { title: "Deep Learning Highlights", data: DEEP_LEARNING },
            { title: "Engineering Highlights", data: ENGINEERING },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              {...slideIn(i % 2 === 0 ? "right" : "left", 0.2 + i * 0.1)}
              className="glass-card p-5"
            >
              <h3 className="mb-4 font-mono text-sm uppercase tracking-widest text-gold">{card.title}</h3>
              <div className="space-y-3">
                {card.data.map((d) => (
                  <StatRow key={d.label} {...d} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

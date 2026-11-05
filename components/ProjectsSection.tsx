"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { ExternalLink, Github } from "lucide-react";
import FloatingIcons from "./FloatingIcons";

/* ---------- Graphics (inline SVG, no image assets needed) ---------- */

function LayeredArchitecture() {
  const layers = ["Routes", "Controllers", "Services", "Repositories"];
  const X = 50, W = 180, H = 28, STEP = 46, TOP = 18;
  const cx = X + W / 2;
  const mono = { fontFamily: "monospace" } as const;
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full text-ink" role="img" aria-label="Customer Management API architecture: Routes to Controllers to Services to Repositories to MySQL database, with Swagger/OpenAPI, 69 Jest/Supertest tests and Docker alongside">
      <defs>
        <marker id="layerArr" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#15803d" />
        </marker>
        <filter id="layerGlowF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="layerBg" cx="35%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#15803d" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="260" className="fill-sage-soft" />
      <rect width="400" height="260" fill="url(#layerBg)" />

      {/* Docker Compose boundary around the whole stack */}
      <rect x="36" y="8" width="208" height="244" rx="10" fill="none" stroke="#9a7424" strokeOpacity="0.55" strokeDasharray="5 4" />

      {/* strictly layered stack */}
      {layers.map((l, i) => {
        const y = TOP + i * STEP;
        return (
          <g key={l}>
            <rect x={X} y={y} width={W} height={H} rx="6" fill="#15803d" fillOpacity="0.1" stroke="#15803d" strokeOpacity="0.8" />
            <text x={cx} y={y + 18} textAnchor="middle" fontSize="12" fill="currentColor" style={mono}>
              {l}
            </text>
            <path
              d={`M${cx} ${y + H} V${y + STEP - 1}`}
              stroke="#15803d"
              strokeWidth="1.6"
              fill="none"
              markerEnd="url(#layerArr)"
              filter="url(#layerGlowF)"
            />
          </g>
        );
      })}

      {/* MySQL database icon box */}
      <rect x={X} y="202" width={W} height="40" rx="6" fill="#9a7424" fillOpacity="0.1" stroke="#9a7424" strokeOpacity="0.85" />
      <g stroke="#9a7424" strokeWidth="1.2" fill="#9a7424" fillOpacity="0.15">
        <ellipse cx="76" cy="213" rx="12" ry="4.5" />
        <path d="M64 213 V229 C64 234 88 234 88 229 V213" />
        <path d="M64 221 C64 226 88 226 88 221" fill="none" />
      </g>
      <text x="152" y="226" textAnchor="middle" fontSize="11.5" fill="currentColor" style={mono}>
        MySQL Database
      </text>

      {/* docker tab on the boundary */}
      <rect x="52" y="2" width="76" height="12" rx="3" className="fill-sage-soft" />
      <text x="90" y="11.5" textAnchor="middle" fontSize="8" fill="#9a7424" style={mono}>
        DOCKER COMPOSE
      </text>

      {/* floating side badges + connectors */}
      <g stroke="#15803d" strokeOpacity="0.5" strokeDasharray="3 3" fill="none">
        <path d="M282 38 H230" />
        <path d="M282 120 H230" />
      </g>
      <path d="M282 190 H244" stroke="#9a7424" strokeOpacity="0.6" strokeDasharray="3 3" fill="none" />

      <g style={mono}>
        <rect x="282" y="22" width="108" height="32" rx="6" fill="#15803d" fillOpacity="0.1" stroke="#15803d" strokeOpacity="0.7" />
        <text x="336" y="42" textAnchor="middle" fontSize="9.5" fill="#15803d">Swagger / OpenAPI</text>

        <rect x="282" y="100" width="108" height="40" rx="6" fill="#15803d" fillOpacity="0.1" stroke="#15803d" strokeOpacity="0.7" />
        <text x="336" y="117" textAnchor="middle" fontSize="10" fill="#15803d">69 Tests</text>
        <text x="336" y="130" textAnchor="middle" fontSize="8" fill="#4b5563">Jest / Supertest</text>

        <rect x="282" y="174" width="108" height="32" rx="6" fill="#9a7424" fillOpacity="0.1" stroke="#9a7424" strokeOpacity="0.8" />
        <text x="336" y="194" textAnchor="middle" fontSize="10" fill="#9a7424">Docker</text>
      </g>
    </svg>
  );
}

function Box({ x, y, w = 62, label, gold }: { x: number; y: number; w?: number; label: string; gold?: boolean }) {
  const c = gold ? "#9a7424" : "#15803d";
  return (
    <g>
      <rect x={x} y={y} width={w} height="26" rx="5" fill={c} fillOpacity="0.1" stroke={c} strokeOpacity="0.7" />
      <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill="currentColor">
        {label}
      </text>
    </g>
  );
}

function Arrow({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="#15803d" strokeOpacity="0.7" strokeWidth="1.2" markerEnd="url(#arr)" />;
}

function Diagram({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 300 80" className="h-auto w-full text-ink" role="img" aria-label={label}>
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill="#15803d" />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

const JwtDiagram = () => (
  <Diagram label="JWT auth flow: client, auth, access and refresh tokens, revocation">
    <Box x={4} y={27} w={52} label="Client" />
    <Arrow d="M56 40 H72" />
    <Box x={72} y={27} w={60} label="Auth" gold />
    <Arrow d="M132 40 H148" />
    <Box x={148} y={12} w={70} label="Access JWT" />
    <Box x={148} y={44} w={70} label="Refresh JWT" gold />
    <Arrow d="M218 25 H234" />
    <Arrow d="M218 57 H234" />
    <Box x={234} y={27} w={60} label="Rotate/Revoke" />
  </Diagram>
);

const MvcDiagram = () => (
  <Diagram label="MVC architecture: model, view, controller with session auth">
    <Box x={4} y={27} w={54} label="Browser" />
    <Arrow d="M58 40 H76" />
    <Box x={76} y={27} w={66} label="Controller" gold />
    <Arrow d="M142 33 C156 20 156 20 170 20" />
    <Box x={170} y={7} w={62} label="Model · PG" />
    <Arrow d="M142 47 C156 60 156 60 170 60" />
    <Box x={170} y={47} w={62} label="View · EJS" gold />
    <Arrow d="M232 60 C262 60 262 40 242 40" />
  </Diagram>
);

const BenchDiagram = () => (
  <Diagram label="Regression benchmark: data, six models, GridSearchCV, cross-validation, best model">
    <Box x={4} y={27} w={46} label="Data" />
    <Arrow d="M50 40 H64" />
    <Box x={64} y={27} w={60} label="6 models" gold />
    <Arrow d="M124 40 H138" />
    <Box x={138} y={27} w={72} label="GridSearchCV" />
    <Arrow d="M210 40 H224" />
    <Box x={224} y={27} w={72} label="k-fold CV" gold />
  </Diagram>
);

/* ---------- Building blocks ---------- */

const card =
  "group glass-card relative overflow-hidden transition duration-300 hover:scale-[1.02] hover:border-matrix/60 hover:shadow-[0_0_32px_rgb(var(--accent)/0.18)] focus-within:border-matrix/60";

const pill = "rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix";

const ctaGold =
  "inline-flex items-center gap-2 rounded-lg border border-gold px-4 py-2 text-sm font-medium text-gold transition hover:bg-gold hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-glass bg-panel px-3 py-2">
      <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-matrix" />
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

type Project = {
  title: string;
  category: string;
  year: string;
  desc: string;
  tech: string[];
  github: string;
};

// Repo links default to your GitHub profile: swap each for the specific repository URL.
const FEATURED: Project = {
  title: "Customer Management API",
  category: "Full-Stack Web Application",
  year: "2026",
  desc: "Designed a strictly layered REST API (routes → controllers → services → repositories) managing sub-resources with cascade deletes and transactional updates. Wrote 69 automated Jest/Supertest tests across 5 suites; containerized with Docker Compose.",
  tech: ["Node.js", "Express.js", "Prisma", "MySQL", "Docker", "Jest", "Swagger/OpenAPI"],
  github: "https://github.com/Shams-Sajid-Rahman/Customer_Management_API",
};

type Compact = Project & { diagram: ReactNode; metrics: { label: string; value: string }[]; wide?: boolean };

const COMPACT: Compact[] = [
  {
    title: "RBAC Admin API",
    category: "Full-Stack Web Application",
    year: "2026",
    desc: "Built a role-based access control backend covering 9 modules across 55+ REST endpoints. Implemented JWT authentication with access/refresh token rotation, server-side revocation, and rate-limited login to prevent brute-force attacks. An automated audit script verified permission enforcement across all 55 routes with a 100% pass rate.",
    tech: ["Node.js", "TypeScript", "Express 5", "PostgreSQL", "Prisma", "JWT"],
    github: "https://github.com/Shams-Sajid-Rahman/RBAC-Admin-api",
    diagram: <JwtDiagram />,
    metrics: [
      { label: "Modules", value: "9" },
      { label: "Endpoints", value: "55+" },
    ],
  },
  {
    title: "CRUD-Based Job Portal",
    category: "Full-Stack Web Application",
    year: "2023",
    desc: "Full-stack job portal with complete CRUD operations, session-based authentication, and role-based access control (RBAC) following MVC architecture. Normalized PostgreSQL schema with dual-role workflows for job seekers and employers. Live on Railway.",
    tech: ["Node.js", "Express.js", "PostgreSQL", "EJS"],
    github: "https://github.com/Shams-Sajid-Rahman/CRUD-Base-Job-Portal",
    diagram: <MvcDiagram />,
    metrics: [
      { label: "Roles", value: "2" },
      { label: "Pattern", value: "MVC" },
    ],
  },
  {
    title: "Stock Price Prediction - ML Regression",
    category: "ML Regression Benchmark",
    year: "2024",
    desc: "Comparative benchmark evaluating 6 algorithms (SVR, Random Forest, Gradient Boosting, KNN, Bayesian Ridge, Decision Tree) with GridSearchCV hyperparameter optimization and k-fold cross-validation. Gradient Boosting achieved best RMSE and R² scores.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    github: "https://github.com/Shams-Sajid-Rahman/STOCK-PRICE-PREDICTION-USING-ML-REGRESSION",
    diagram: <BenchDiagram />,
    metrics: [
      { label: "Algorithms", value: "6" },
      { label: "Best model", value: "Gradient Boosting" },
    ],
    wide: true,
  },
];

const MORE: { title: string; href: string; category: string; desc: string; tech: string[] }[] = [
  {
    title: "Chest X-ray Assistant",
    href: "https://github.com/Shams-Sajid-Rahman/medxray-assistant",
    category: "Medical AI",
    desc: "Pneumonia detection app built on a DenseNet121 transfer-learning classifier, reaching 91.2% accuracy and 0.975 AUC on the 624-image official test set. Shows Grad-CAM heatmaps of the regions behind each prediction and writes a short summary using RAG (Chroma + Gemini), with a template fallback if the LLM is down. Grad-CAM revealed shortcut learning on burned-in text markers, which is documented along with the limitations.",
    tech: ["Python", "PyTorch", "Grad-CAM", "Chroma", "Gemini API", "Gradio", "Docker"],
  },
  {
    title: "Sajsub Tech",
    href: "https://github.com/Shams-Sajid-Rahman/Sajsub_Tech",
    category: "Full-Stack E-Commerce Platform",
    desc: "E-commerce platform with a storefront, an admin dashboard, and an AI shopping assistant. Customers get search with autocomplete, carts, wishlists, reviews, and checkout with SSLCommerz online payments, where every payment is verified server-side before an order is confirmed. Admins manage products, inventory, orders, refunds, and users. The Gemini-powered assistant answers product questions through read-only tools with personal details redacted. Backed by 195 automated tests.",
    tech: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Prisma", "Gemini API"],
  },
  {
    title: "IELTiva",
    href: "https://github.com/Shams-Sajid-Rahman/IELTiva",
    category: "AI-Assisted IELTS Prep Platform",
    desc: "IELTS preparation platform built for students in Bangladesh, with international use planned later. It covers Listening and Reading practice, mock tests, and AI-assisted Writing and Speaking feedback, plus study plans, analytics, and prepaid packages. It's a TypeScript monorepo with a Next.js frontend and an Express API with a BullMQ worker, using PostgreSQL, Redis, and Cloudflare R2. Claude powers the AI feedback, and AI band scores stay hidden until they're checked against human-marked samples. Includes 367 automated tests across the API, UI components, and browser flows.",
    tech: ["Next.js", "TypeScript", "Node.js", "Prisma", "PostgreSQL", "Redis", "BullMQ", "Gemini API"],
  },
  {
    title: "IELTS AI Tutor Pro",
    href: "https://huggingface.co/spaces/ShamsSajidRahman/IELTS-Tutor-Pro",
    category: "Conversational AI Agent",
    desc: "LLM-powered IELTS coaching agent deployed on Hugging Face Spaces. Uses Google Gemini API to assess all 4 IELTS skill areas and estimate band scores automatically. Multi-turn feedback via LangChain across 10+ IELTS practice task types.",
    tech: ["Python", "Gemini API", "LangChain", "Gradio"],
  },
  {
    title: "MehediHub",
    href: "https://github.com/Shams-Sajid-Rahman/MehediHub",
    category: "Full-Stack Marketplace Platform",
    desc: "Bangladesh's first NID-verified Mehedi (henna) artist marketplace. Features a 2-step registration flow with Tesseract.js OCR to verify National ID documents, role-based dashboards for customers, artists, and admins, service bookings, a product marketplace with cart/checkout, and a verified-review system.",
    tech: ["Node.js", "Express.js", "MySQL", "EJS", "Tesseract.js OCR", "Bootstrap 5"],
  },
  {
    title: "Local Service Finder",
    href: "https://github.com/Shams-Sajid-Rahman/Local-Service-Finder",
    category: "Cross-Platform Mobile App",
    desc: "Flutter marketplace connecting customers with local service providers through separate admin, client, and provider experiences. Uses Firebase Authentication and Cloud Firestore, geolocation-based provider search, and document verification via Google ML Kit and Tesseract OCR.",
    tech: ["Flutter", "Dart", "Firebase", "Cloud Firestore", "Geolocation", "OCR"],
  },
  {
    title: "Student Management System",
    href: "https://github.com/Shams-Sajid-Rahman/StudentManagementSystem",
    category: "Java Desktop Application",
    desc: "Desktop application for managing student records with a custom modern UI theme built on Java Swing. Supports CRUD operations for students and subjects, grade tracking across semesters, and enrollment management through dedicated dialog-based workflows.",
    tech: ["Java", "Swing", "OOP"],
  },
  {
    title: "Paris Olympics Portal",
    href: "https://github.com/Shams-Sajid-Rahman/paris-olympics-portal",
    category: "Frontend Web App · In Progress",
    desc: "Frontend for a Paris Olympics-themed sports portal, scaffolded with React, Vite, and Tailwind/DaisyUI. Route structure covers public pages for events, medal tables, highlights, stories, and a games shop with checkout, alongside authenticated admin and user-management dashboards behind private routes. Configured with Firebase, React Router, React Query, Socket.io client, and SweetAlert2.",
    tech: ["React", "Vite", "Tailwind CSS", "DaisyUI", "Firebase"],
  },
];

/** Repo link: GitHub icon, or a "HF Space" chip for Hugging Face links. */
function GithubLink({ href, title }: { href: string; title: string }) {
  const hf = href.includes("huggingface.co");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title} on ${hf ? "Hugging Face" : "GitHub"}`}
      className={
        hf
          ? "inline-flex shrink-0 items-center gap-1 rounded-full border border-gold/50 px-2 py-0.5 font-mono text-[10px] text-gold transition hover:bg-gold hover:text-white"
          : "shrink-0 text-muted transition hover:text-gold"
      }
    >
      {hf ? (
        <>
          HF Space <ExternalLink size={11} />
        </>
      ) : (
        <Github size={18} />
      )}
    </a>
  );
}

function CompactCard({ p, i }: { p: Compact; i: number }) {
  return (
    <motion.article
      {...slideIn(i % 2 === 1 ? "right" : "left", 0.1 * i)}
      className={`${card} p-5 ${p.wide ? "lg:col-span-3" : ""}`}
    >
      <FloatingIcons variant={i} />
      <div className={p.wide ? "grid gap-6 md:grid-cols-2" : ""}>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-matrix">
            {p.category} ({p.year})
          </p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <GithubLink href={p.github} title={p.title} />
          </div>
          <p className="mt-2 text-sm text-muted">{p.desc}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <li key={t} className={pill}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className={p.wide ? "flex flex-col justify-end gap-3" : "mt-4"}>
          <div className="rounded-lg border border-glass bg-panel p-2">{p.diagram}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {p.metrics.map((m) => (
              <Metric key={m.label} {...m} />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="section">
      <motion.div
        {...slideIn("left")}
      >
        <p className="section-label">&gt; ls ./projects</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">PROJECTS</h2>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Featured */}
        <motion.article
          {...slideIn("left")}
          className={`${card} flex flex-col lg:col-span-2 lg:row-span-2`}
        >
          <FloatingIcons variant={0} />
          <div className="aspect-[16/10] w-full overflow-hidden border-b border-glass">
            <div className="h-full w-full transition duration-500 group-hover:scale-105">
              <LayeredArchitecture />
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">
              Featured · {FEATURED.category} ({FEATURED.year})
            </p>
            <h3 className="mt-1 text-2xl font-bold">{FEATURED.title}</h3>
            <p className="mt-3 text-sm text-muted">{FEATURED.desc}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {FEATURED.tech.map((t) => (
                <li key={t} className={pill}>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-2">
              <a href={FEATURED.github} target="_blank" rel="noopener noreferrer" className={ctaGold}>
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>
        </motion.article>

        <CompactCard p={COMPACT[0]} i={1} />
        <CompactCard p={COMPACT[1]} i={2} />
        <CompactCard p={COMPACT[2]} i={3} />
      </div>

      {/* Additional projects */}
      <motion.h3
        {...slideIn("right")}
        className="mb-4 mt-12 font-mono text-sm uppercase tracking-widest text-gold"
      >
        More Projects
      </motion.h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MORE.map((m, i) => (
          <motion.article
            key={m.title}
            {...slideIn(i % 2 === 0 ? "right" : "left", 0.08 * i)}
            className={`${card} p-5`}
          >
            <FloatingIcons variant={i + 1} />
            <p className="font-mono text-[10px] uppercase tracking-widest text-matrix">{m.category}</p>
            <div className="mt-1 flex items-start justify-between gap-3">
              <h4 className="font-semibold">{m.title}</h4>
              <GithubLink href={m.href} title={m.title} />
            </div>
            <p className="mt-1 text-sm text-muted">{m.desc}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {m.tech.map((t) => (
                <li key={t} className={pill}>
                  {t}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

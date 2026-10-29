"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { BadgeCheck, ExternalLink } from "lucide-react";

type Role = {
  title: string;
  org: string;
  period: string;
  initials: string;
  logo?: string; // organisation logo under /public
  impact: string[];
  certId?: string;
  link?: { href: string; label: string };
};

const ROLES: Role[] = [
  {
    title: "General Secretary · Active Member (4 Years)",
    org: "NSU ACM Student Chapter",
    period: "2026 – Present",
    initials: "ACM",
    logo: "/logos/nsu-acm.png",
    link: { href: "https://nsusc.acm.org/members/2211684042/", label: "View Official NSU ACM Profile" },
    impact: [
      "Organized 15+ programming contests, technical workshops, and knowledge-sharing sessions for a 300+ member community, sustaining consistent event engagement over 4 years of chapter involvement.",
      "Handled vendor coordination, sponsor management, and recruitment across chapter events.",
      "Earned the Best Member Award, selected from over 300 active members, for 4 years of outstanding technical contributions and sustained leadership across all chapter events.",
    ],
  },
  {
    title: "Professional WordPress Mastery Zero to Hero",
    org: "UY LAB",
    period: "Feb 2025 – May 2025",
    initials: "UY",
    logo: "/logos/uy-lab.png",
    impact: [
      "Completed an intensive 3-month professional training program covering end-to-end WordPress development, from fundamentals to advanced mastery. Issued May 20, 2025.",
    ],
    certId: "WMZH-02502027839",
  },
  {
    title: "Complete Web Development Course",
    org: "Programming Hero",
    period: "June 2025 – Present",
    initials: "PH",
    logo: "/logos/programming-hero.png",
    impact: [
      "Batch 12 · Instructor: Jhankar Mahbub.",
      "Currently pursuing an intensive full-stack web development bootcamp covering modern frontend and backend technologies including React.js, Node.js, and MongoDB.",
    ],
  },
];

function Avatar({ role }: { role: Role }) {
  const [failed, setFailed] = useState(!role.logo);
  const cls = "h-16 w-16 shrink-0 rounded-2xl border border-gold/40";
  if (failed) {
    return (
      <div
        aria-hidden="true"
        className={`${cls} flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 font-mono text-sm font-bold text-ink/80`}
      >
        {role.initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={role.logo}
      alt={`${role.org} logo`}
      onError={() => setFailed(true)}
      className={`${cls} bg-[#ffffff] object-contain p-1.5 shadow-sm`}
    />
  );
}

export default function LeadershipSection() {
  return (
    <section id="leadership" className="section">
      <motion.div
        {...slideIn("right")}
      >
        <p className="section-label">&gt; community.impact</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">LEADERSHIP &amp; ACHIEVEMENTS</h2>
      </motion.div>

      <ul className="mx-auto mt-10 max-w-3xl space-y-5">
        {ROLES.map((r, i) => (
          <motion.li
            key={r.title}
            {...slideIn(i % 2 === 0 ? "left" : "right", 0.05 * i)}
            className="glass-card flex gap-4 p-5 transition duration-300 hover:border-matrix/50 hover:shadow-[0_0_28px_rgb(var(--accent)/0.12)] sm:gap-5 sm:p-6"
          >
            <Avatar role={r} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-gold">{r.org}</p>
                </div>
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
                  {r.period}
                </span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {r.impact.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-matrix" />
                    {b}
                  </li>
                ))}
              </ul>
              {r.link && (
                <a
                  href={r.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gold px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {r.link.label} <ExternalLink size={12} />
                </a>
              )}
              {r.certId && (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-matrix/30 bg-matrix/10 px-2.5 py-0.5 font-mono text-xs text-matrix">
                  <BadgeCheck size={13} /> Certificate ID: {r.certId}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

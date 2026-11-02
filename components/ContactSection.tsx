"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { Check, Clock, Copy, Github, Linkedin, Mail, MapPin, type LucideIcon } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import Globe from "./Globe";

const SOCIALS = [
  { label: "LinkedIn", href: PROFILE.linkedin, icon: Linkedin },
  { label: "GitHub", href: PROFILE.github, icon: Github },
  { label: "Email", href: `mailto:${PROFILE.email}`, icon: Mail },
];

const DETAILS: { label: string; value: string; href?: string; icon: LucideIcon }[] = [
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}`, icon: Mail },
  { label: "LinkedIn", value: "linkedin.com/in/shams-sajid-rahman-93670b262", href: PROFILE.linkedin, icon: Linkedin },
  { label: "GitHub", value: "github.com/Shams-Sajid-Rahman", href: PROFILE.github, icon: Github },
  { label: "Location", value: PROFILE.city, icon: MapPin },
];

function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: PROFILE.timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)
    : "--:--:--";

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <Clock size={14} className="text-gold" />
      <span className="tabular-nums text-ink">{time}</span>
      <span className="text-muted">{PROFILE.timeZone}</span>
    </div>
  );
}

export default function ContactSection() {
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
    setTimeout(() => setCopy("idle"), 2000);
  };

  return (
    <section id="contact" className="section">
      <motion.div
        {...slideIn("left")}
      >
        <p className="section-label">&gt; contact</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Let&apos;s build{" "}
          <span className="bg-gradient-to-r from-matrix to-accent2 bg-clip-text text-transparent">what&apos;s next</span>{" "}
          together.
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">
          Open to AI/ML and software engineering opportunities where I can contribute to meaningful products and grow
          alongside a strong team.
        </p>
      </motion.div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
        {/* Left: primary contact + details */}
        <div className="flex min-w-0 flex-col gap-6">
          <motion.div {...slideIn("left")} className="glass-card relative overflow-hidden p-6">
            <Mail aria-hidden="true" size={120} strokeWidth={1} className="absolute -bottom-6 -right-4 -z-10 text-matrix/15" />
            <p className="font-mono text-xs uppercase tracking-widest text-matrix">Primary contact</p>
            <p className="mt-3 break-all text-2xl font-bold tracking-tight text-ink">{PROFILE.email}</p>
            <p className="mt-2 text-sm text-ink/80">
              The best way to reach me about roles, collaborations or research opportunities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-xl bg-matrix px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix"
              >
                {copy === "copied" ? <Check size={16} /> : <Copy size={16} />}
                <span aria-live="polite">
                  {copy === "copied" ? "Copied!" : copy === "failed" ? "Copy failed" : "Copy email"}
                </span>
              </button>
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 rounded-xl border border-ink/20 bg-panel px-5 py-2.5 text-sm font-medium text-ink transition hover:border-matrix hover:bg-matrix hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix"
              >
                <Mail size={16} /> Open mail
              </a>
            </div>
          </motion.div>

          <motion.ul {...slideIn("left", 0.1)} className="glass-card flex-1 divide-y divide-glass overflow-hidden">
            {DETAILS.map(({ label, value, href, icon: Icon }) => {
              const body = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-matrix/30 bg-matrix/10 text-matrix">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{label}</span>
                    <span className="block break-words text-sm font-medium text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-matrix/10"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4">{body}</div>
                  )}
                </li>
              );
            })}
          </motion.ul>
        </div>

        {/* Right: globe */}
        <motion.div
          {...slideIn("right", 0.1)}
          className="glass-card flex flex-col p-5"
        >
          <LocalClock />

          <div className="relative mt-2 min-h-[20rem] flex-1">
            <div className="absolute inset-0">
              <Globe lat={PROFILE.lat} lon={PROFILE.lon} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:border-matrix hover:bg-matrix hover:text-white hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-matrix"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

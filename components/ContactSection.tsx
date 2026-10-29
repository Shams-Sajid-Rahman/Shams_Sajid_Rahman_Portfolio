"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { slideIn } from "@/lib/motion";
import { Clock, Download, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import Globe from "./Globe";

const SOCIALS = [
  { label: "LinkedIn", href: PROFILE.linkedin, icon: Linkedin },
  { label: "GitHub", href: PROFILE.github, icon: Github },
  { label: "Email", href: `mailto:${PROFILE.email}`, icon: Mail },
];

const field =
  "w-full rounded-lg border border-glass bg-panel px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-matrix/70 focus:shadow-glow";
const labelCls = "mb-1.5 block font-mono text-xs uppercase tracking-widest text-muted";

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
  const [sent, setSent] = useState(false);

  // No backend: opens the visitor's mail client with the message pre-filled.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = encodeURIComponent(String(f.get("subject")));
    const body = encodeURIComponent(`${f.get("message")}\n\n${f.get("name")} <${f.get("email")}>`);
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="section">
      <motion.div
        {...slideIn("left")}
      >
        <p className="section-label">&gt; ping --me</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">CONTACT</h2>
      </motion.div>

      <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
        {/* Form */}
        <motion.form
          onSubmit={onSubmit}
          {...slideIn("left")}
          className="glass-card space-y-4 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>
                Name
              </label>
              <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>
                Email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={field} />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className={labelCls}>
              Subject
            </label>
            <input id="subject" name="subject" required placeholder="What's this about?" className={field} />
          </div>
          <div>
            <label htmlFor="message" className={labelCls}>
              Message
            </label>
            <textarea id="message" name="message" required rows={6} placeholder="Tell me about your project or opportunity..." className={`${field} resize-y`} />
          </div>
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-matrix px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-emerald-800 hover:shadow-[0_0_36px_rgb(var(--accent)/0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix"
          >
            <Send size={16} /> Send Message
          </button>
          <p className="h-4 text-center font-mono text-xs text-muted" aria-live="polite">
            {sent ? "Opening your email app to finish sending…" : ""}
          </p>
        </motion.form>

        {/* Details + globe */}
        <motion.div
          {...slideIn("right", 0.1)}
          className="glass-card flex flex-col p-5"
        >
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-gold" />
              <a href={`mailto:${PROFILE.email}`} className="break-all text-ink hover:text-matrix">
                {PROFILE.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted">
              <MapPin size={14} className="shrink-0 text-gold" />
              <span>{PROFILE.city}</span>
            </li>
            <li>
              <LocalClock />
            </li>
          </ul>

          <div className="min-h-[16rem] flex-1">
            <Globe lat={PROFILE.lat} lon={PROFILE.lon} />
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
            <a
              href={PROFILE.resume}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-matrix hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <Download size={16} /> Download Resume
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

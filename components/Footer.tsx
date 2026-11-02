"use client";

import type { MouseEvent } from "react";
import { ArrowUp, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { getLenis, scrollToSection } from "@/lib/lenis";
import { PROFILE } from "@/lib/profile";
import { SECTIONS } from "@/lib/sections";

const SOCIALS = [
  { label: "LinkedIn", href: PROFILE.linkedin, icon: Linkedin },
  { label: "GitHub", href: PROFILE.github, icon: Github },
  { label: "Email", href: `mailto:${PROFILE.email}`, icon: Mail },
];

// A shorter list than the navbar, so the bar stays on one line.
const LINKS = SECTIONS.filter(({ id }) => id !== "research" && id !== "leadership");

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-glass bg-panel text-ink transition hover:border-matrix hover:bg-matrix hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix";

export default function Footer() {
  const jump = (e: MouseEvent, id: string) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-glass bg-sage/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 py-7 text-center lg:flex-row lg:justify-between lg:text-left 2xl:max-w-7xl min-[1920px]:max-w-[90rem]">
        <div>
          <p className="flex items-center justify-center gap-2 font-semibold text-ink lg:justify-start">
            <Terminal size={16} className="text-matrix" /> {PROFILE.name}
          </p>
          <p className="mt-1 text-sm text-muted lg:whitespace-nowrap">
            © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 lg:flex-nowrap">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => jump(e, id)}
                  className="inline-block rounded-md px-2 py-1 text-sm text-muted transition hover:bg-matrix hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={iconBtn}
            >
              <Icon size={16} />
            </a>
          ))}
          <button type="button" onClick={toTop} aria-label="Back to top" title="Back to top" className={`${iconBtn} ml-2`}>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, Terminal, X } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { getLenis } from "@/lib/lenis";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setActive(e.target.id);
          const v = getComputedStyle(e.target).getPropertyValue("--accent").trim();
          if (v) document.documentElement.style.setProperty("--accent", v);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // While the mobile menu is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close the menu if the viewport grows to desktop width.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const jump = (e, id) => {
    e.preventDefault();
    setOpen(false);
    // Wait a tick so the scroll lock is released before scrolling.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }, 60);
  };

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
          scrolled ? "border-glass bg-sage/80" : "border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 2xl:max-w-7xl min-[1920px]:max-w-[90rem]" aria-label="Primary">
          <a
            href="#about"
            onClick={(e) => jump(e, "about")}
            className="flex items-center gap-2 font-mono text-sm text-ink"
          >
            <Terminal size={18} className="text-matrix" />
            <span>
              shams<span className="text-matrix">.</span>dev
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => jump(e, id)}
                  aria-current={active === id ? "true" : undefined}
                  className={`relative rounded-md px-3 py-2 text-sm transition-colors hover:text-ink ${
                    active === id ? "text-ink" : "text-muted"
                  }`}
                >
                  {label}
                  {active === id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-matrix shadow-glow"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="rounded-full border border-glass bg-panel p-2 text-muted transition hover:bg-matrix hover:text-white"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          <button
            type="button"
            className="rounded-md p-2 text-muted hover:text-ink lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <Menu size={22} />
          </button>
          </div>
        </nav>
      </motion.header>

      {/* Slide-out overlay. Lives outside <header> so backdrop-filter there can't trap its fixed positioning. */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            <motion.aside
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(20rem,85vw)] flex-col border-l border-glass bg-sage-soft/95 p-6 shadow-[-24px_0_48px_rgba(17,24,39,0.18)] backdrop-blur-md lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-matrix">&gt; navigate</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-2 text-muted hover:text-ink"
                >
                  <X size={22} />
                </button>
              </div>

              <ul className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
                {SECTIONS.map(({ id, label }, i) => {
                  const on = active === id;
                  return (
                    <motion.li
                      key={id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + i * 0.04 }}
                    >
                      <a
                        href={`#${id}`}
                        onClick={(e) => jump(e, id)}
                        aria-current={on ? "true" : undefined}
                        className={`flex items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-base transition-colors ${
                          on
                            ? "border-matrix bg-matrix/10 text-ink shadow-glow"
                            : "border-transparent text-muted hover:bg-matrix hover:text-white"
                        }`}
                      >
                        <span className={`font-mono text-xs ${on ? "text-matrix" : "text-muted/60"}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

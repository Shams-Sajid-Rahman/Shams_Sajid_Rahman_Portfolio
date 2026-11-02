import type Lenis from "lenis";

// Shared handle so the navbar can drive the same smooth-scroll instance.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smoothly scrolls to a section, leaving room for the sticky navbar. */
export const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

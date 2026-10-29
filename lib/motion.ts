// Scroll-triggered entrance: "right" slides in from the right edge, "left" from the left.
export const slideIn = (from: "left" | "right", delay = 0) => ({
  initial: { opacity: 0, x: from === "right" ? 50 : -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

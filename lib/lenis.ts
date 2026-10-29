import type Lenis from "lenis";

// Shared handle so the navbar can drive the same smooth-scroll instance.
let instance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

"use client";

import { MotionConfig } from "framer-motion";

// Honors the visitor's "reduce motion" OS setting for every Framer Motion animation.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

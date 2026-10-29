"use client";

import { motion } from "framer-motion";

// Unified page transition: content eases in on every route render.
export default function Template({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

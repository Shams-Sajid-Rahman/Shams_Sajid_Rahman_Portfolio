"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/profile";

type Props = { className?: string; initials?: string; grayscale?: boolean; src?: string; fit?: "cover" | "contain" };

/** Shows the profile photo from /public; falls back to an initials placeholder if the file is missing. */
export default function Portrait({
  className = "",
  initials = "SSR",
  grayscale = true,
  src = PROFILE.photo,
  fit = "cover",
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 font-mono font-bold text-ink/80 ${className}`}
        aria-label="Portrait placeholder"
      >
        {initials}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Portrait of ${PROFILE.name}`}
      onError={() => setFailed(true)}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${grayscale ? "grayscale contrast-125" : ""} ${className}`}
    />
  );
}

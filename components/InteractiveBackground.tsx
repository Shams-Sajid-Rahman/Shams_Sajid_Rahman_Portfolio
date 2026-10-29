"use client";

import { useEffect, useRef } from "react";

type Orb = { x: number; y: number; r: number; vx: number; vy: number; rgb: string; a: number; ph: number };

// sage / mint / emerald tones
const ORBS = [
  { r: 0.42, rgb: "52,211,153", a: 0.3 }, // mint-emerald
  { r: 0.4, rgb: "96,165,250", a: 0.26 }, // sky blue
  { r: 0.36, rgb: "167,139,250", a: 0.24 }, // violet
  { r: 0.34, rgb: "251,191,36", a: 0.22 }, // amber
  { r: 0.32, rgb: "251,113,133", a: 0.18 }, // rose
  { r: 0.46, rgb: "163,196,171", a: 0.28 }, // sage
];

// Dark theme palette: cyan / blue / violet on navy, much subtler
const DARK_ORB = ["34,211,238", "96,165,250", "129,140,248", "96,165,250", "34,211,238", "167,139,250"];

/**
 * Fixed full-screen canvas: drifting ambient light orbs and (dark theme) a receding hexagon grid,
 * both with gentle pointer parallax. Never captures input, never blocks scrolling.
 */
export default function InteractiveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    // Decorative background: slowed for reduced-motion visitors, but never frozen or hidden.
    const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
    const reduced = false;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let raf = 0;
    let last = 0;
    const mouse = { x: -9999, y: -9999, tx: 0, ty: 0, active: false };

    const orbs: Orb[] = ORBS.map((o, i) => ({
      ...o,
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      ph: i * 1.7,
    }));

    // ---- hexagon grid: three cached layers at different scales give a sense of depth ----
    const HEX = [
      { size: 190, alpha: 0.2, glow: 8, fill: 0.14, par: 34 }, // near, large, brightest
      { size: 105, alpha: 0.11, glow: 0, fill: 0.08, par: 18 }, // mid
      { size: 300, alpha: 0.13, glow: 10, fill: 0.1, par: 52 }, // far-large, soft
    ];
    const HEX_PAD = 90;
    let hexLayers: HTMLCanvasElement[] = [];
    const buildHex = () => {
      hexLayers = HEX.map((L) => {
        const cv = document.createElement("canvas");
        cv.width = Math.round(w + HEX_PAD * 2);
        cv.height = Math.round(h + HEX_PAD * 2);
        const c = cv.getContext("2d")!;
        const s = L.size;
        const hh = Math.sqrt(3) * s;
        c.lineWidth = 1.2;
        c.strokeStyle = `rgba(130,225,255,${L.alpha})`;
        if (L.glow) {
          c.shadowColor = "rgba(90,210,255,0.8)";
          c.shadowBlur = L.glow;
        }
        for (let col = -1; col * 1.5 * s < cv.width + s; col++) {
          for (let row = -1; row * hh < cv.height + hh; row++) {
            const cx = col * 1.5 * s;
            const cy = row * hh + (col & 1 ? hh / 2 : 0);
            c.beginPath();
            for (let k = 0; k < 6; k++) {
              const ang = (Math.PI / 3) * k; // flat-top hexagon
              const px = cx + s * Math.cos(ang);
              const py = cy + s * Math.sin(ang);
              if (k === 0) c.moveTo(px, py);
              else c.lineTo(px, py);
            }
            c.closePath();
            if (Math.random() < 0.16) {
              c.save();
              c.shadowBlur = 0;
              c.fillStyle = `rgba(80,200,255,${L.fill * (0.4 + Math.random() * 0.6)})`;
              c.fill();
              c.restore();
            }
            c.stroke();
          }
        }
        return cv;
      });
    };

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    buildHex();

    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      // Ignore small height changes (mobile URL bar showing/hiding while scrolling).
      if (nw === w && Math.abs(nh - h) < 120) return;
      const sx = nw / w;
      const sy = nh / h;
      w = nw;
      h = nh;
      size();
      buildHex();
      for (const o of orbs) {
        o.x *= sx;
        o.y *= sy;
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize, { passive: true });

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05) * slow; // clamp so tab switches do not cause jumps
      last = now;
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.dataset.theme !== "light";

      // smooth the pointer
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      // parallax offset for the orbs, -1..1
      const px = mouse.active ? (mouse.x / w - 0.5) * 2 : 0;
      const py = mouse.active ? (mouse.y / h - 0.5) * 2 : 0;

      // ambient orbs
      const t = (now / 1000) * slow;
      for (let oi = 0; oi < orbs.length; oi++) {
        const o = orbs[oi];
        if (!reduced) {
          o.x += o.vx * dt;
          o.y += o.vy * dt;
        }
        const R = o.r * Math.max(w, h);
        if (o.x < -R * 0.3 || o.x > w + R * 0.3) o.vx *= -1;
        if (o.y < -R * 0.3 || o.y > h + R * 0.3) o.vy *= -1;
        const cx = o.x + px * 26 * (o.r + 0.4);
        const cy = o.y + py * 26 * (o.r + 0.4);
        const pulse = 0.88 + 0.12 * Math.sin(t * 0.35 + o.ph);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * pulse);
        const orgb = dark ? DARK_ORB[oi % DARK_ORB.length] : o.rgb;
        const oa = dark ? o.a * 0.4 : o.a;
        g.addColorStop(0, `rgba(${orgb},${oa})`);
        g.addColorStop(1, `rgba(${orgb},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      }

      // dark theme: receding hexagon grid with mouse parallax and slow breathing
      if (dark) {
        for (let i = 0; i < hexLayers.length; i++) {
          const L = HEX[i];
          const driftX = Math.sin(t * 0.05 + i * 2) * 14;
          const driftY = Math.cos(t * 0.04 + i * 3) * 10;
          ctx.globalAlpha = 0.85 + 0.15 * Math.sin(t * 0.3 + i);
          ctx.drawImage(hexLayers[i], -HEX_PAD - px * L.par + driftX, -HEX_PAD - py * L.par + driftY);
        }
        ctx.globalAlpha = 1;
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Pause entirely while the tab is hidden.
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="bg-fade-in pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}

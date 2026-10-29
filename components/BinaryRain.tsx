"use client";

import { useEffect, useRef } from "react";

const SCALE = 0.55; // rendered at reduced resolution, then upscaled: a free, cheap "out of focus" look

/**
 * A separate, softly out-of-focus binary "code rain" layer that sits behind the hexagon
 * grid and the network. Columns of 0/1 fall continuously at different speeds, lengths
 * and densities, and individual digits keep flipping.
 */
export default function BinaryRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    // Decorative background: slowed for reduced-motion visitors, but never frozen or hidden.
    const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
    const reduced = false;

    let W = 0, H = 0, raf = 0, visible = true, last = 0, acc = 0;
    let colW = 14;
    const rowH = 12;
    let cols: { x: number; head: number; speed: number; len: number; on: boolean; fs: number; wait: number }[] = [];
    let chars = new Uint8Array(0);
    let rows = 0;

    const build = () => {
      W = Math.max(1, Math.round(window.innerWidth * SCALE));
      H = Math.max(1, Math.round(window.innerHeight * SCALE));
      canvas.width = W;
      canvas.height = H;
      colW = window.innerWidth < 768 ? 20 : 14;
      rows = Math.ceil(H / rowH) + 2;
      const n = Math.ceil(W / colW);
      chars = new Uint8Array(n * rows).map(() => (Math.random() < 0.5 ? 0 : 1));
      cols = Array.from({ length: n }, (_, i) => ({
        x: i * colW + colW / 2,
        head: Math.random() * (H + 200) - 100,
        speed: 22 + Math.random() * 70,
        len: 8 + Math.floor(Math.random() * 20),
        on: Math.random() < 0.62, // varied density: some columns are empty
        fs: Math.random() < 0.35 ? 8 : 11, // two sizes for depth
        wait: 0,
      }));
    };
    build();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // keep digits flipping
      const flips = Math.ceil(chars.length * 0.012);
      for (let f = 0; f < flips; f++) {
        const i = (Math.random() * chars.length) | 0;
        chars[i] ^= 1;
      }
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        if (!col.on) {
          // empty columns occasionally come alive, and live ones occasionally go quiet
          if (Math.random() < 0.002) col.on = true;
          continue;
        }
        if (!reduced) col.head += col.speed * dt;
        if (col.head - col.len * rowH > H) {
          col.head = -Math.random() * 120;
          col.speed = 22 + Math.random() * 70;
          col.len = 8 + Math.floor(Math.random() * 20);
          if (Math.random() < 0.25) col.on = false;
        }
        ctx.font = `${col.fs}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        for (let k = 0; k < col.len; k++) {
          const y = col.head - k * rowH;
          if (y < -rowH || y > H + rowH) continue;
          const row = Math.max(0, Math.min(rows - 1, Math.round(y / rowH)));
          const ch = chars[c * rows + row] ? "1" : "0";
          const a = k === 0 ? 0.95 : Math.pow(1 - k / col.len, 1.6) * 0.55;
          ctx.fillStyle = k === 0 ? `rgba(205,245,255,${a})` : `rgba(100,210,255,${a})`;
          ctx.fillText(ch, col.x, y);
        }
      }
    };

    const loop = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      acc += dt;
      if (acc >= 1 / 30) {
        draw(acc * slow); // 30 fps is plenty for a blurred background layer
        acc = 0;
      }
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    start();
    if (reduced) draw(0);

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="bg-fade-in pointer-events-none fixed inset-0 -z-[15] hidden h-full w-full opacity-60 dark:block"
      style={{ imageRendering: "auto" }}
    />
  );
}

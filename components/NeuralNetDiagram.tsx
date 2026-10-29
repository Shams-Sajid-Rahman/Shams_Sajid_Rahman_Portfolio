"use client";

import { useEffect, useRef } from "react";

const LAYERS = [3, 4, 5, 4, 2];
const LABELS = ["Input layer", "Hidden layer 1", "Hidden layer 2", "Hidden layer 3", "Output layer"];
const STEP = 0.9; // seconds for a signal to cross one layer
const PAUSE = 0.6; // pause at each end of a pass
const SPIN = (Math.PI * 2) / 22; // one full 360° turn every ~22 s
const PITCH = -0.22; // slight downward camera tilt so the 3D depth reads clearly
const FOCAL = 3.4;

type Edge = { a: number; b: number; l: number; w: number };

function palette(dark: boolean) {
  return dark
    ? {
        line: "148,190,255",
        fwd: "34,211,238",
        bwd: "167,139,250",
        nodeStroke: "200,225,255",
        nodeFill: "rgba(8,16,36,0.92)",
        label: "rgba(214,228,255,0.9)",
        sub: "rgba(148,190,255,0.8)",
      }
    : {
        line: "60,40,120",
        fwd: "109,40,217",
        bwd: "219,39,119",
        nodeStroke: "76,29,149",
        nodeFill: "rgba(255,255,255,0.95)",
        label: "rgba(30,20,60,0.9)",
        sub: "rgba(76,29,149,0.85)",
      };
}

/**
 * Animated feed-forward network (3-4-5-4-2) in the classic textbook layout, spinning a full
 * 360° in 3D. Signals propagate forward layer by layer, then flow back (backpropagation);
 * edge weights re-shuffle every cycle and the output probabilities update.
 */
export default function NeuralNetDiagram() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const slow = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
    let w = 0, h = 0, raf = 0, visible = true, last = 0, clock = 0;
    let yaw = -0.35;
    let hover = false;

    // topology + 3D positions (world units). Nodes zig-zag in depth so the network has volume when it turns.
    const start: number[] = [];
    let total = 0;
    for (const n of LAYERS) {
      start.push(total);
      total += n;
    }
    const layerOf = LAYERS.flatMap((n, l) => Array(n).fill(l) as number[]);
    const GY = 0.42;
    const world = Array.from({ length: total }, (_, k) => {
      const l = layerOf[k];
      const i = k - start[l];
      const n = LAYERS[l];
      return {
        x: (l / (LAYERS.length - 1)) * 2 - 1,
        y: (i - (n - 1) / 2) * GY,
        z: (i % 2 ? 0.22 : -0.22) + (l % 2 ? 0.12 : -0.12),
      };
    });
    const edges: Edge[] = [];
    for (let l = 0; l < LAYERS.length - 1; l++) {
      for (let i = 0; i < LAYERS[l]; i++) {
        for (let j = 0; j < LAYERS[l + 1]; j++) edges.push({ a: start[l] + i, b: start[l + 1] + j, l, w: Math.random() });
      }
    }
    const phase = Array.from({ length: total }, () => Math.random() * Math.PI * 2);
    let outputs = [0.82, 0.18];
    let cycle = -1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    const arrow = (x: number, y: number, ang: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - size * Math.cos(ang - 0.4), y - size * Math.sin(ang - 0.4));
      ctx.lineTo(x - size * Math.cos(ang + 0.4), y - size * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
    };

    const frame = (now: number) => {
      if (!visible) {
        raf = 0;
        return;
      }
      const dt = Math.min((now - last) / 1000 || 0.016, 0.05) * slow;
      last = now;
      clock += dt;
      yaw += SPIN * dt * (hover ? 0.3 : 1); // keeps turning; slows down while hovered so it can be read
      const dark = document.documentElement.dataset.theme !== "light";
      const P = palette(dark);

      // pass timeline: forward 0 -> 4, pause, backward 4 -> 0, pause
      const span = (LAYERS.length - 1) * STEP;
      const period = 2 * (span + PAUSE);
      const tc = clock % period;
      const thisCycle = Math.floor(clock / period);
      if (thisCycle !== cycle) {
        cycle = thisCycle;
        for (const e of edges) e.w = Math.min(1, Math.max(0.08, e.w + (Math.random() - 0.5) * 0.5));
        const p = 0.6 + Math.random() * 0.38;
        outputs = [p, 1 - p];
      }
      let forward = true;
      let pos: number;
      if (tc < span) pos = tc / STEP;
      else if (tc < span + PAUSE) pos = LAYERS.length - 1;
      else if (tc < 2 * span + PAUSE) {
        forward = false;
        pos = LAYERS.length - 1 - (tc - span - PAUSE) / STEP;
      } else pos = 0;
      const sig = forward ? P.fwd : P.bwd;

      // projection
      ctx.clearRect(0, 0, w, h);
      const S = Math.max(40, Math.min(w / 2 - 34, (h / 2 - 50) / 0.95));
      const cx = w / 2;
      const cy = h / 2 + 8;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw);
      const cp = Math.cos(PITCH), sp = Math.sin(PITCH);
      const pts = world.map((v, k) => {
        const by = v.y + Math.cos(clock * 0.7 + phase[k]) * 0.025;
        const x1 = v.x * cyw + v.z * syw;
        const z1 = -v.x * syw + v.z * cyw;
        const y2 = by * cp - z1 * sp;
        const z2 = by * sp + z1 * cp;
        const s = FOCAL / (FOCAL + z2);
        return { x: cx + x1 * S * s, y: cy + y2 * S * s, z: z2, s };
      });
      const Rb = Math.max(7, Math.min(14, Math.min(w, h) * 0.03));
      const depthA = (z: number) => 0.45 + 0.55 * Math.min(1, Math.max(0, (1.2 - z) / 2.4)); // nearer = brighter

      // edges
      for (const e of edges) {
        const A = pts[e.a], B = pts[e.b];
        const ang = Math.atan2(B.y - A.y, B.x - A.x);
        const ax = A.x + Math.cos(ang) * Rb * A.s, ay = A.y + Math.sin(ang) * Rb * A.s;
        const bx = B.x - Math.cos(ang) * Rb * B.s, by = B.y - Math.sin(ang) * Rb * B.s;
        const da = depthA((A.z + B.z) / 2);
        const local = forward ? pos - e.l : e.l + 1 - pos;
        const active = local > 0 && local < 1;
        const base = (0.14 + 0.22 * e.w) * da;
        ctx.lineWidth = active ? 1 + e.w * 1.6 : 1;
        ctx.strokeStyle = active ? `rgba(${sig},${(0.35 + 0.5 * e.w) * da})` : `rgba(${P.line},${base})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.fillStyle = `rgba(${P.line},${base + 0.18})`;
        arrow(bx, by, ang, 5.5 * B.s);

        if (active) {
          const f = forward ? local : 1 - local;
          const px = ax + (bx - ax) * f;
          const py = ay + (by - ay) * f;
          ctx.save();
          ctx.shadowColor = `rgba(${sig},1)`;
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(${sig},${(0.6 + 0.4 * e.w) * da})`;
          ctx.beginPath();
          ctx.arc(px, py, (1.6 + e.w * 1.8) * A.s, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // nodes, painted far-to-near
      const order = pts.map((_, k) => k).sort((i, j) => pts[j].z - pts[i].z);
      for (const k of order) {
        const l = layerOf[k];
        const p = pts[k];
        const R = Rb * p.s;
        const da = depthA(p.z);
        const act = Math.max(0, 1 - Math.abs(pos - l) * 1.6);
        if (act > 0) {
          const g = ctx.createRadialGradient(p.x, p.y, R * 0.6, p.x, p.y, R * 2.6);
          g.addColorStop(0, `rgba(${sig},${0.55 * act * da})`);
          g.addColorStop(1, `rgba(${sig},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, R * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = P.nodeFill;
        ctx.beginPath();
        ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
        ctx.fill();
        if (act > 0) {
          ctx.fillStyle = `rgba(${sig},${0.75 * act})`;
          ctx.fill();
        }
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = act > 0.3 ? `rgb(${sig})` : `rgba(${P.nodeStroke},${0.85 * da})`;
        ctx.stroke();
      }

      // layer labels follow their column as it turns
      const fs = Math.max(10, Math.min(13, w * 0.024));
      ctx.font = `600 ${fs}px Inter, system-ui, -apple-system, "Segoe UI", sans-serif`;
      ctx.textAlign = "center";
      for (let l = 0; l < LAYERS.length; l++) {
        let topY = Infinity, sx = 0, sz = 0;
        for (let i = 0; i < LAYERS[l]; i++) {
          const p = pts[start[l] + i];
          topY = Math.min(topY, p.y);
          sx += p.x;
          sz += p.z;
        }
        const n = LAYERS[l];
        ctx.fillStyle = P.label;
        ctx.globalAlpha = depthA(sz / n);
        ctx.fillText(LABELS[l], sx / n, Math.max(fs + 4, topY - Rb - 10));
      }
      ctx.globalAlpha = 1;

      // output probabilities beside the output nodes (kept clear of the circles and inside the canvas)
      const showOut = forward && pos >= LAYERS.length - 1.05;
      ctx.font = `${fs - 1}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (let i = 0; i < 2; i++) {
        const p = pts[start[LAYERS.length - 1] + i];
        const txt = `ŷ${i + 1} ${outputs[i].toFixed(2)}`;
        const tw = ctx.measureText(txt).width;
        const R = Rb * p.s;
        const right = p.x + R + 8;
        const toRight = right + tw < w - 6;
        ctx.textAlign = toRight ? "left" : "right";
        ctx.fillStyle = showOut ? `rgb(${P.fwd})` : P.sub;
        ctx.fillText(txt, toRight ? right : p.x - R - 8, p.y + 4);
      }

      ctx.textAlign = "left";
      ctx.fillStyle = P.sub;
      ctx.fillText(forward ? "▶ forward pass" : "◀ backpropagation", 14, h - 12);

      raf = requestAnimationFrame(frame);
    };
    const startLoop = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    startLoop();

    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) startLoop();
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Animated 3D neural network rotating 360 degrees: input layer, three hidden layers and an output layer, with signals flowing forward and backpropagating"
      className="absolute inset-0 h-full w-full"
    />
  );
}

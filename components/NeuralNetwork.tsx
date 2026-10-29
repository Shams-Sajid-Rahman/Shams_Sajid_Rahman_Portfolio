"use client";

import { useEffect, useRef } from "react";

type Node3 = { x: number; y: number; z: number; layer: number; gold: boolean; phase: number };

const LAYERS = [4, 6, 6, 4, 3];
let GREEN = "22,163,74";
let GOLD = "154,116,36";

function buildNodes(): { nodes: Node3[]; edges: [number, number][] } {
  const nodes: Node3[] = [];
  const starts: number[] = [];
  LAYERS.forEach((count, l) => {
    starts.push(nodes.length);
    const cols = Math.ceil(Math.sqrt(count));
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const rows = Math.ceil(count / cols);
      nodes.push({
        x: (l - (LAYERS.length - 1) / 2) * 1.1,
        y: (row - (rows - 1) / 2) * 0.9,
        z: (col - (cols - 1) / 2) * 0.9,
        layer: l,
        gold: (i + l) % 4 === 0,
        phase: Math.random() * Math.PI * 2,
      });
    }
  });
  const edges: [number, number][] = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    for (let a = 0; a < LAYERS[l]; a++) {
      for (let b = 0; b < LAYERS[l + 1]; b++) edges.push([starts[l] + a, starts[l + 1] + b]);
    }
  }
  return { nodes, edges };
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const { nodes, edges } = buildNodes();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let yaw = 0.5;
    let pitch = -0.25;
    let targetYaw = 0.5;
    let targetPitch = -0.25;
    let hovering = false;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
      targetYaw = 0.5 + nx * 0.9;
      targetPitch = -0.25 + ny * 0.6;
    };
    const onEnter = () => (hovering = true);
    const onLeave = () => {
      hovering = false;
      targetYaw = 0.5;
      targetPitch = -0.25;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);

    const project = (n: Node3) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = n.x * cy + n.z * sy;
      const z1 = -n.x * sy + n.z * cy;
      const y2 = n.y * cp - z1 * sp;
      const z2 = n.y * sp + z1 * cp;
      const scale = Math.min(w / 6.2, h / 4.2);
      const persp = 5 / (5 + z2);
      return { sx: w / 2 + x1 * scale * persp, sy: h / 2 + y2 * scale * persp, depth: z2, persp };
    };

    // Pause rendering while off-screen to keep scrolling at 60 FPS.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    function draw() {
      if (!visible) {
        raf = 0;
        return;
      }
      const dk = document.documentElement.dataset.theme !== "light";
      GREEN = dk ? "34,211,238" : "22,163,74";
      GOLD = dk ? "167,139,250" : "154,116,36";
      t += 0.016;
      if (!hovering && !reduced) targetYaw += 0.003;
      yaw += (targetYaw - yaw) * 0.06;
      pitch += (targetPitch - pitch) * 0.06;

      ctx.clearRect(0, 0, w, h);
      const pts = nodes.map(project);

      // edges, with a pulse travelling forward along each
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const pa = pts[a], pb = pts[b];
        const alpha = 0.16 + 0.14 * ((pa.persp + pb.persp) / 2 - 0.7);
        ctx.strokeStyle = `rgba(${GREEN},${Math.max(alpha, 0.08)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();

        if (i % 3 === 0) {
          const p = (t * 0.5 + i * 0.137) % 1;
          const px = pa.sx + (pb.sx - pa.sx) * p;
          const py = pa.sy + (pb.sy - pa.sy) * p;
          ctx.fillStyle = `rgba(${nodes[a].gold ? GOLD : GREEN},0.8)`;
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes back-to-front
      const order = nodes.map((_, i) => i).sort((i, j) => pts[j].depth - pts[i].depth);
      for (const i of order) {
        const n = nodes[i];
        const p = pts[i];
        const col = n.gold ? GOLD : GREEN;
        const pulse = 0.75 + 0.25 * Math.sin(t * 2 + n.phase);
        const r = (4 + 2 * pulse) * p.persp;
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 4);
        g.addColorStop(0, `rgba(${col},0.55)`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${col})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full cursor-grab touch-pan-y"
      role="img"
      aria-label="Interactive 3D neural network visualization"
    />
  );
}

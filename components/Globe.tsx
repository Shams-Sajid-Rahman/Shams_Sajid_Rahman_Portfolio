"use client";

import { useEffect, useRef } from "react";
import { LAND_POINTS } from "@/lib/landPoints";

type Props = { lat: number; lon: number };

let GREEN = "22,163,74";
let GOLD = "154,116,36";

// Unit vector for a lat/lon in degrees (y up).
function toVec(lat: number, lon: number): [number, number, number] {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)];
}

export default function Globe({ lat, lon }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Dotted world map: one dot per sampled land point (Natural Earth land outlines)
    const cloud: [number, number, number][] = [];
    for (let i = 0; i < LAND_POINTS.length; i += 2) cloud.push(toVec(LAND_POINTS[i], LAND_POINTS[i + 1]));
    const loc = toVec(lat, lon);

    let w = 0, h = 0, raf = 0;
    let yaw = -(lon * Math.PI) / 180; // start facing the location
    let pitch = (lat * Math.PI) / 180 * 0.6;
    let vel = 0.004;
    let dragging = false;
    let lastX = 0, lastY = 0;

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

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      vel = (e.clientX - lastX) * 0.006;
      yaw += vel;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + (e.clientY - lastY) * 0.004));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
      if (Math.abs(vel) < 0.002) vel = 0.004;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    const rotate = (v: [number, number, number]) => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw);
      const cp = Math.cos(pitch), sp = Math.sin(pitch);
      const x1 = v[0] * cy + v[2] * sy;
      const z1 = -v[0] * sy + v[2] * cy;
      const y2 = v[1] * cp - z1 * sp;
      const z2 = v[1] * sp + z1 * cp;
      return [x1, y2, z2] as const;
    };

    // Pause rendering while off-screen to keep scrolling at 60 FPS.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    function draw(time: number) {
      if (!visible) {
        raf = 0;
        return;
      }
      const dk = document.documentElement.dataset.theme !== "light";
      GREEN = dk ? "34,211,238" : "22,163,74";
      GOLD = dk ? "167,139,250" : "154,116,36";
      if (!dragging && !reduced) {
        yaw += vel;
        vel += (0.004 - vel) * 0.03; // ease back to idle spin
      }
      const R = Math.min(w, h) * 0.4;
      const cx = w / 2, cy = h / 2;
      ctx.clearRect(0, 0, w, h);

      // soft halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 1.25);
      halo.addColorStop(0, `rgba(${GREEN},0.18)`);
      halo.addColorStop(1, `rgba(${GREEN},0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // wireframe latitude / longitude lines (front hemisphere only)
      ctx.lineWidth = 0.7;
      const line = (fn: (t: number) => [number, number, number]) => {
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i <= 64; i++) {
          const [x, y, z] = rotate(fn((i / 64) * Math.PI * 2));
          if (z < 0) {
            pen = false;
            continue;
          }
          const px = cx + x * R, py = cy - y * R;
          if (pen) ctx.lineTo(px, py);
          else ctx.moveTo(px, py);
          pen = true;
        }
        ctx.stroke();
      };
      ctx.strokeStyle = `rgba(${GREEN},0.3)`;
      for (let d = -60; d <= 60; d += 30) {
        const la = (d * Math.PI) / 180;
        line((t) => [Math.cos(la) * Math.cos(t), Math.sin(la), Math.cos(la) * Math.sin(t)]);
      }
      for (let d = 0; d < 180; d += 30) {
        const lo = (d * Math.PI) / 180;
        line((t) => [Math.cos(t) * Math.sin(lo), Math.sin(t), Math.cos(t) * Math.cos(lo)]);
      }

      // continents: bright on the near side, a faint ghost on the far side
      for (const p of cloud) {
        const [x, y, z] = rotate(p);
        if (z > 0) {
          const a = 0.45 + 0.55 * z;
          const d = 1.4 + 0.9 * z;
          ctx.fillStyle = `rgba(${GREEN},${a})`;
          ctx.fillRect(cx + x * R - d / 2, cy - y * R - d / 2, d, d);
        } else {
          ctx.fillStyle = `rgba(${GREEN},0.07)`;
          ctx.fillRect(cx + x * R - 0.6, cy - y * R - 0.6, 1.2, 1.2);
        }
      }

      // location node with expanding ping
      const [lx, ly, lz] = rotate(loc);
      if (lz > 0) {
        const px = cx + lx * R, py = cy - ly * R;
        const ping = ((time / 1500) % 1);
        ctx.strokeStyle = `rgba(${GOLD},${1 - ping})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 4 + ping * 18, 0, Math.PI * 2);
        ctx.stroke();
        const g = ctx.createRadialGradient(px, py, 0, px, py, 14);
        g.addColorStop(0, `rgba(${GOLD},0.8)`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgb(${GOLD})`;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [lat, lon]);

  return (
    <canvas
      ref={ref}
      className="h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      role="img"
      aria-label="Interactive dotted world-map globe showing my location in Dhaka, Bangladesh"
    />
  );
}

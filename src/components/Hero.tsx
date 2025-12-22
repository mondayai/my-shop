"use strict";
"use client";

import { useEffect, useRef } from "react";
import GlobalSearch from "./GlobalSearch";

interface Star {
  dx: number;
  dy: number;
  z: number;
  sizeBase: number;
}

const randDir = () => {
  const a = Math.random() * Math.PI * 2;
  return { dx: Math.cos(a), dy: Math.sin(a) };
};

const randomSizeBase = () => {
  const r = Math.random();
  if (r < 0.75) return 0.25 + Math.random() * 0.6; // small
  if (r < 0.95) return 0.9 + Math.random() * 1.0; // medium
  return 2.0 + Math.random() * 1.8; // large
};

const createStar = (depth: number): Star => {
  const { dx, dy } = randDir();
  return {
    dx,
    dy,
    z: Math.random() * depth,
    sizeBase: randomSizeBase(),
  };
};

const resetStar = (star: Star, depth: number) => {
  const { dx, dy } = randDir();
  star.dx = dx;
  star.dy = dy;
  star.z = depth;
  star.sizeBase = randomSizeBase();
};

const updateStar = (star: Star, speed: number, depth: number) => {
  star.z -= speed;
  if (star.z <= 1) resetStar(star, depth);
};

const drawStar = (
  star: Star,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fov: number,
  spread: number,
  depth: number,
  mouseX: number,
  mouseY: number,
  repelRadius: number,
  repelStrength: number
) => {
  // progress: 0 (far) => 1 (near)  -> start at center then move outwards
  const p = 1 - star.z / depth;

  // base position in "world"
  const x = star.dx * spread * p;
  const y = star.dy * spread * p;
  const z = star.z;

  // project to screen (no camera rotation now)
  const scale = fov / z;
  let screenX = x * scale + width / 2;
  let screenY = y * scale + height / 2;

  // === Mouse "repel ring" interaction (in screen-space) ===
  // push stars away from mouse inside a radius
  const vx = screenX - mouseX;
  const vy = screenY - mouseY;
  const dist = Math.hypot(vx, vy);

  if (dist > 0.0001 && dist < repelRadius) {
    // falloff: 1 at center -> 0 at edge
    const t = 1 - dist / repelRadius;

    // smooth curve so the boundary is soft
    const falloff = t * t * (3 - 2 * t); // smoothstep

    // push amount (scaled by strength, and a bit by perspective so near stars react more)
    const push = repelStrength * falloff * (0.6 + 0.8 * p);

    const nx = vx / dist;
    const ny = vy / dist;

    screenX += nx * push;
    screenY += ny * push;
  }

  // size grows as it approaches camera
  const size = Math.min(6, Math.max(0.12, star.sizeBase * scale));

  // alpha similar to before
  const alphaFar = Math.min(1, Math.max(0, p * 1.25));
  const alphaNear = Math.min(1, Math.max(0, (z - 50) / 220));
  const alphaSize = 1 / (1 + Math.max(0, star.sizeBase - 1) * 0.35);
  const alpha = Math.min(alphaFar, alphaNear) * alphaSize;

  ctx.beginPath();
  ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(66, 133, 244, ${alpha})`;
  ctx.fill();
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Mouse position (default center)
    let mouseX = width / 2;
    let mouseY = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // keep mouse reasonable after resize
      mouseX = Math.min(Math.max(mouseX, 0), width);
      mouseY = Math.min(Math.max(mouseY, 0), height);
    };

    resize();
    window.addEventListener("resize", resize);

    // Config
    const starCount = 2000;
    const speed = 0.5;
    const spread = 900;
    const depth = 2000;
    const fov = 1000;

    // Interaction tuning (ปรับตรงนี้)
    const repelRadius = 180; // วงแหวกรอบเมาส์ (ลอง 140-260)
    const repelStrength = 120; // แรงผลัก (ลอง 60-200)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    // ใช้ pointermove จะรองรับ touchpad/pen ดีกว่า
    window.addEventListener("pointermove", onMouseMove);

    const stars: Star[] = Array.from({ length: starCount }, () =>
      createStar(depth)
    );

    let raf = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        updateStar(s, speed, depth);
        drawStar(
          s,
          ctx,
          width,
          height,
          fov,
          spread,
          depth,
          mouseX,
          mouseY,
          repelRadius,
          repelStrength
        );
      }

      raf = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-[#f8f9fa] text-[#121317]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-auto"
      />

      {/* Gradient Overlay for better text contrast */}
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-white/20 to-white/80"
        style={{
          boxShadow: "none",
        }}
      />

      <div className="container-custom relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Export-Ready Thai Brands
        </div>

        <div className="w-full flex justify-center mb-12">
          <GlobalSearch variant="hero" />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-semibold tracking-tight mb-6 leading-[1.1] text-[#121317]">
          Thailand&apos;s Premium <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            Skincare Brands
          </span>{" "}
          Marketplace
        </h1>

        <h2 className="text-xl md:text-2xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-light">
          Source authentic Thai beauty products directly from verified brand
          owners. Quality certified by FDA Thailand.
        </h2>

        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            FDA Approved
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            DITP Certified
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Direct Factory Price
          </span>
        </div>
      </div>
    </section>
  );
}

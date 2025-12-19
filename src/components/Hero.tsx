"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      opacity: number;
    }[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    function animate() {
      if (!ctx || !canvas) return; // Safety check
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 overflow-hidden bg-[var(--hero-star)] text-white">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-radial-gradient from-transparent to-[var(--hero-star)]"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, var(--hero-star) 80%)",
        }}
      ></div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        {/* Logo Icon Large */}
        <div className="mb-8 p-4 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight mb-6 max-w-5xl leading-[1.1]">
          Experience liftoff with the next-generation IDE
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Google Antigravity is an agentic development environment that helps
          you code at the speed of thought.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="#"
            className="h-14 px-8 rounded-full bg-white text-[var(--foreground)] font-medium text-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            Download for macOS
          </Link>
          <Link
            href="#"
            className="h-14 px-8 rounded-full border border-white/20 text-white font-medium text-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            Explore use cases
          </Link>
        </div>
      </div>
    </section>
  );
}

"use strict";
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// Helper types and functions outside component
interface Star {
  x: number;
  y: number;
  z: number;
}

const createStar = (spread: number, depth: number): Star => ({
  x: (Math.random() - 0.5) * spread,
  y: (Math.random() - 0.5) * spread,
  z: Math.random() * depth,
});

const updateStar = (
  star: Star,
  speed: number,
  depth: number,
  spread: number
) => {
  star.z -= speed;
  if (star.z <= 0) {
    star.z = depth;
    star.x = (Math.random() - 0.5) * spread;
    star.y = (Math.random() - 0.5) * spread;
  }
};

const drawStar = (
  star: Star,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fov: number,
  tiltX: number,
  tiltY: number
) => {
  // Apply Parallax/Tilt to the 3D coordinate
  const radX = (tiltX * Math.PI) / 180;
  const radY = (tiltY * Math.PI) / 180;

  const cosX = Math.cos(radX);
  const sinX = Math.sin(radX);
  const cosY = Math.cos(radY);
  const sinY = Math.cos(radY);

  // 1. Rotate Y (Left/Right)
  const x1 = star.x * cosY + star.z * sinY;
  const z1 = -star.x * sinY + star.z * cosY;

  // 2. Rotate X (Up/Down)
  const y1 = star.y * cosX - z1 * sinX;
  const z2 = star.y * sinX + z1 * cosX;

  // 3. Project
  if (z2 <= 0) return; // Behind camera

  const scale = fov / z2;
  const screenX = x1 * scale + width / 2;
  const screenY = y1 * scale + height / 2;

  // Draw Dot
  ctx.beginPath();
  const size = Math.max(0.5, 1.5 * scale); // Smaller base size for cleaner look
  ctx.arc(screenX, screenY, size, 0, Math.PI * 2);

  // Fade out when very close to camera to avoid "flash"
  const alpha = Math.min(1, Math.max(0, (z2 - 50) / 200));

  ctx.fillStyle = `rgba(66, 133, 244, ${alpha})`; // Google Blue
  ctx.fill();
  ctx.globalAlpha = 1.0;
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

    const dpr = window.devicePixelRatio || 1;
    // Set explicit width/height for high DPI
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Configuration
    const starCount = 1000; // Increased count for "warp" density
    const speed = 2; // Warp speed
    const spread = 2000; // How wide the field is in 3D space
    const depth = 2000; // How deep the field goes
    const fov = 300; // Field of view (focal length)

    // Interaction State
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate Normalized Device Coordinates (-1 to 1)
      mouseX = (x / width) * 2 - 1;
      mouseY = (y / height) * 2 - 1;

      // Target tilt based on mouse position
      targetTiltX = mouseY * 40; // Max tilt degrees vertically
      targetTiltY = -mouseX * 40; // Max tilt degrees horizontally
    };
    window.addEventListener("mousemove", onMouseMove);

    const stars: Star[] = Array.from({ length: starCount }, () =>
      createStar(spread, depth)
    );

    let animationFrameId: number;

    const render = () => {
      // Smooth interpolation for tilt
      tiltX += (targetTiltX - tiltX) * 0.05;
      tiltY += (targetTiltY - tiltY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        updateStar(star, speed, depth, spread);
        drawStar(star, ctx, width, height, fov, tiltX, tiltY);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-[#f8f9fa] text-[#121317]">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-auto"
      />

      {/* Vignette Overlay - Blue/White Radial */}
      {/* Simulating the specific Antigravity glow: light center, blue-ish edges */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(248,249,250,0) 0%, rgba(66,133,244,0.05) 100%)",
          boxShadow: "inset 0 0 100px rgba(66,133,244,0.1)",
        }}
      ></div>

      <div className="container-custom relative z-10 flex flex-col items-center text-center px-4">
        {/* Antigravity Logo */}
        <div className="mb-12">
          <svg
            viewBox="0 0 118 24"
            className="h-8 w-auto text-[#121317]"
            aria-label="Google Antigravity"
          >
            <g fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </g>
          </svg>
          <span className="sr-only">Antigravity</span>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tight mb-4 leading-[1] text-[#121317]">
          Experience liftoff
        </h1>
        <h2 className="text-4xl md:text-6xl lg:text-[3.5rem] font-normal tracking-tight mb-12 text-[#121317] opacity-90">
          with the next-generation IDE
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link
            href="#"
            className="h-14 px-10 rounded-full bg-[#121317] text-white font-medium text-lg flex items-center justify-center hover:bg-[#3c4043] transition-colors shadow-lg shadow-gray-200"
          >
            Download for macOS
          </Link>
          <Link
            href="#"
            className="h-14 px-10 rounded-full border border-gray-300 text-[#121317] font-medium text-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            Explore use cases
          </Link>
        </div>
      </div>
    </section>
  );
}

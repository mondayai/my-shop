"use client";

import Link from "next/link";
import NavAuth from "./NavAuth";
import GlobalSearch from "./GlobalSearch";
import { useEffect, useState } from "react";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show search in nav after scrolling past hero (approx 500px)
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--nav-bg)] backdrop-blur-md border-b border-white/10">
      <div className="container-custom flex items-center justify-between h-16 px-4 relative">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--foreground)] hover:opacity-80 transition-opacity"
          >
            {/* Logo Icon */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-lg tracking-tight">
                Thai Skincare
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                Export Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Nav Search - Centered Absoluted */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out transform z-[60] w-[calc(100%-2rem)] max-w-2xl ${
            isScrolled
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none translate-y-[-150%]"
          }`}
        >
          <GlobalSearch variant="nav" />
        </div>

        <div className="flex items-center gap-4">
          <NavAuth />
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--nav-bg)] backdrop-blur-md border-b border-white/10">
      <div className="container-custom flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--foreground)] hover:opacity-80 transition-opacity"
          >
            {/* Simple Logo Placeholder */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
            <span className="font-medium text-lg tracking-tight">
              Google Antigravity
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Product
          </Link>
          <Link
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Use cases
          </Link>
          <Link
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="hover:text-[var(--foreground)] transition-colors"
          >
            Resources
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white transition-colors bg-[var(--primary)] rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Download
          </Link>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border)]">
      {/* Pre-footer CTA Area */}
      <div className="bg-[var(--foreground)] text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience liftoff today.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[var(--foreground)] font-medium hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.498 13.996c.265-1.574 1.282-2.73 2.668-3.32-.57-1.428-1.464-2.522-2.822-3.097-1.185-.494-2.316-.289-3.23.076-.927.42-2.02.502-3.097.025-1.107-.463-2.126-.412-2.924-.101-1.434.553-2.613 1.76-3.344 3.254-1.455 3.012-.416 7.647 1.056 9.773.722 1.056 1.576 2.083 2.707 2.035 1.08.025 1.503-.699 2.822-.699 1.343.024 1.706.699 2.846.674 1.185-.025 1.905-.98 2.613-2.01 1.62-2.348 2.275-4.634 2.3-4.66-.05-.025-1.393-.53-1.6-3.05zm-.392-8.324c.602-.72 1.01-1.708.89-2.672-.865.05-1.922.58-2.54 1.32-.54.601-.987 1.554-.866 2.479.963.075 1.95-.412 2.516-1.127z" />
              </svg>
              Download for Apple Silicon
            </Link>
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Intel</title>
                <path d="M21.92 10.37c-.375-3.313-3.692-5.742-7.838-5.742-5.462 0-8.913 3.492-8.913 8.355 0 3.734 3.02 7.15 7.427 7.15 2.57 0 4.63-1.074 5.92-2.93l-.265-.125c-1.144 1.487-2.915 2.193-4.882 2.193-3.473 0-5.733-2.56-5.733-5.32 0-3.69 2.652-6.425 6.942-6.425 3.655 0 6.01 1.754 6.64 4.844h.7zm-6.66 4.717c-1.488 0-2.67-1.173-2.67-2.67 0-1.488 1.182-2.66 2.67-2.66 1.48 0 2.66 1.172 2.66 2.66 0 1.497-1.18 2.67-2.66 2.67zM1.378 19.344V4.992c10.16.895 21 0 21.137 0v14.352zM21.168.64H1.323C.59.64 0 1.23 0 1.963v20.06c0 .732.59 1.322 1.323 1.322h19.845c.73 0 1.32-.59 1.32-1.323V1.964c0-.733-.59-1.323-1.32-1.323z" />
              </svg>
              Download for Intel Mac
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">Available for macOS 12+</p>
        </div>
      </div>

      <div className="container-custom py-12 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
          <span className="font-bold text-gray-900 text-lg">Google</span>
          <Link href="#" className="hover:text-gray-900">
            Privacy
          </Link>
          <Link href="#" className="hover:text-gray-900">
            Terms
          </Link>
          <Link href="#" className="hover:text-gray-900">
            About Google
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Social Icon Placeholders */}
          <Link href="#" aria-label="Twitter">
            <svg
              className="w-5 h-5 hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
            </svg>
          </Link>
          <Link href="#" aria-label="GitHub">
            <svg
              className="w-5 h-5 hover:text-gray-900"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}

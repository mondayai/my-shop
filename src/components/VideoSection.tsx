import { Rubik_Glitch } from "next/font/google";

export default function VideoSection() {
  return (
    <section className="py-12 md:py-24 bg-[var(--background)]">
      <div className="container-custom">
        <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-2xl border border-gray-200 bg-gray-900">
          {/* Placeholder for Video - using an image or simple gradient for now */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-950 text-white/20">
            <span className="text-2xl font-medium">
              Product Demo Video Placeholder
            </span>

            {/* Play Button Mock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

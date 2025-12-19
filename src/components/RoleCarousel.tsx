"use client";

import { useState } from "react";

const roles = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "fullstack", label: "Full Stack" },
  { id: "mobile", label: "Mobile" },
] as const;

type RoleType = (typeof roles)[number]["id"];

const content: Record<
  RoleType,
  { title: string; description: string; code: string }
> = {
  frontend: {
    title: "Build beautiful UIs faster.",
    description:
      "Generate components, preview changes in real-time, and let agents handle state management complexity.",
    code: "function App() { return <Antigravity /> }",
  },
  backend: {
    title: "Scale your infrastructure.",
    description:
      "Design microservices architectures and let Antigravity generate the boilerplate, config, and deployment scripts.",
    code: "class Service extends Microservice { ... }",
  },
  fullstack: {
    title: "End-to-end development.",
    description:
      "Seamlessly move between frontend and backend. Your agents understand the full context of your application.",
    code: "export const api = trpc.router({ ... })",
  },
  mobile: {
    title: "Cross-platform native.",
    description:
      "Write once, run everywhere. Antigravity optimizes your code for iOS and Android performance.",
    code: "<View style={styles.container}>...</View>",
  },
};

export default function RoleCarousel() {
  const [activeRole, setActiveRole] = useState<RoleType>("frontend");

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="container-custom">
        <div className="mb-12">
          <h2 className="text-4xl font-medium mb-8 text-[var(--foreground)]">
            Built for every developer.
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`pb-4 px-2 text-lg font-medium transition-colors relative ${
                  activeRole === role.id
                    ? "text-[var(--foreground)]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {role.label}
                {activeRole === role.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--foreground)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          <div>
            <h3 className="text-3xl font-medium mb-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
              {content[activeRole].title}
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 delay-100">
              {content[activeRole].description}
            </p>
            <div className="mt-8">
              <button className="text-[var(--foreground)] font-medium border-b border-black pb-1 hover:opacity-70 transition-opacity">
                Learn more about {roles.find((r) => r.id === activeRole)?.label}{" "}
                agents
              </button>
            </div>
          </div>

          <div className="bg-[#1e1e1e] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="mt-8 font-mono text-sm text-gray-300">
              <pre>
                <code>{content[activeRole].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

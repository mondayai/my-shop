export default function Features() {
  const features = [
    {
      title: "An AI IDE Core",
      description:
        "Built from the ground up to integrate generative AI into every aspect of the development lifecycle.",
      color: "bg-blue-50",
    },
    {
      title: "Higher-level Abstractions",
      description:
        "Define your intent and let agents handle the implementation details across the stack.",
      color: "bg-purple-50",
    },
    {
      title: "Cross-surface Agents",
      description:
        "Your agents follow you from the IDE to the browser, terminal, and deployment tools.",
      color: "bg-orange-50",
    },
  ];

  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-medium mb-16 text-[var(--foreground)]">
          Reimagining development.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`rounded-[32px] p-8 md:p-10 h-[500px] flex flex-col justify-between transition-transform hover:scale-[1.01] duration-300 ${feature.color} border border-gray-100`}
            >
              <div>
                <h3 className="text-2xl font-medium mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
              {/* Visual Placeholder for Feature Graphic */}
              <div className="w-full h-48 bg-white/50 rounded-2xl border border-black/5 flex items-center justify-center text-sm text-gray-400">
                Feature Visual {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

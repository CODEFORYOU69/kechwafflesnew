"use client";

const ITEMS = [
  "Gaufres artisanales",
  "Chocolat Callebaut",
  "Crème pistache premium",
  "Mascarpone",
  "Pâte pétrie chaque matin",
  "Cuisson minute",
  "Bubble · Tiramisu · Pizza",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-hidden
      className="relative z-10 border-y border-white/5 bg-[hsl(var(--ink-900))] py-6 overflow-hidden"
    >
      <div className="flex whitespace-nowrap animate-marquee">
        {row.map((t, i) => (
          <span
            key={i}
            className="mx-8 inline-flex items-center gap-8 text-eyebrow text-[hsl(var(--text-subtle))]"
          >
            {t}
            <span className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]" />
          </span>
        ))}
      </div>
    </section>
  );
}

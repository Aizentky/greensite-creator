import { useEffect, useRef, useState, type ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="mb-12 text-center">
        {eyebrow && (
          <div className="mb-2 font-display text-xs uppercase tracking-[0.4em] text-primary">{eyebrow}</div>
        )}
        <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-wider text-foreground">
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

export function FeatureCard({ icon, title, items }: { icon: string; title: string; items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setWiggle(true);
            window.setTimeout(() => setWiggle(false), 700);
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition hover:border-primary/60 hover:-translate-y-1 ${wiggle ? "animate-wiggle" : ""}`}
      style={{ boxShadow: "var(--shadow-elegant)" }}
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="font-display text-2xl font-black uppercase tracking-widest text-primary">{title}</h3>
      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
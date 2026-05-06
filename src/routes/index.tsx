import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Download, MessageCircle, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 text-center">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <h1 className="font-display text-[12rem] leading-none font-black tracking-tighter md:text-[18rem] animate-pulse-glow">
        <span className="text-foreground">S</span>
        <span className="text-primary">W</span>
      </h1>
      <h2 className="mt-6 font-display text-3xl md:text-5xl font-bold uppercase tracking-widest text-foreground">
        The Ultimate PvP Client
      </h2>
      <p className="mt-4 text-muted-foreground text-lg">Dominate on DonutSMP and beyond</p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/50 px-5 py-2 text-sm">
        <Check className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Supported Version:</span>
        <span className="font-bold text-primary">1.21</span>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/download"
          className="group inline-flex items-center gap-3 rounded-lg bg-primary px-8 py-4 font-display font-bold uppercase tracking-widest text-primary-foreground transition hover:scale-105"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <Download className="h-5 w-5" /> Download
        </Link>
        <a
          href="https://discord.gg/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-lg border-2 border-primary/60 bg-transparent px-8 py-4 font-display font-bold uppercase tracking-widest text-primary transition hover:bg-primary/10"
        >
          <MessageCircle className="h-5 w-5" /> Discord
        </a>
      </div>
    </section>
  );
}

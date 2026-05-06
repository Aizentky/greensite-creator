import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/sevware/Section";
import type React from "react";

export const Route = createFileRoute("/installation")({
  head: () => ({
    meta: [
      { title: "Installation Guide — Sevware Client" },
      { name: "description", content: "How to install Sevware Client on Feather, Prism and other Minecraft launchers." },
    ],
  }),
  component: InstallationPage,
});

type Step = {
  n: number;
  title: string;
  body: React.ReactNode;
};

const steps: Step[] = [
  {
    n: 1,
    title: "Install Fabric Loader",
    body: (
      <p>
        Download and run the{" "}
        <a href="https://fabricmc.net/use/installer/" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
          Fabric Installer
        </a>
        . Select Minecraft version <span className="text-primary font-semibold">1.21</span> and click Install.
      </p>
    ),
  },
  {
    n: 2,
    title: "Download Fabric API",
    body: (
      <p>
        Get{" "}
        <a href="https://modrinth.com/mod/fabric-api" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">
          Fabric API
        </a>{" "}
        for version 1.21 and place the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.jar</code> file in your mods folder.
      </p>
    ),
  },
  {
    n: 3,
    title: "Download Sevware Client",
    body: <p>Head to the Login page and sign in to get the latest Sevware Client <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.jar</code> file.</p>,
  },
  {
    n: 4,
    title: "Install Sevware Client",
    body: (
      <div className="space-y-3">
        <p>
          Move the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">Sevware-Client.jar</code> file into your Minecraft mods folder:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="rounded-lg border border-border bg-background/40 p-3">
            <span className="font-display uppercase tracking-widest text-primary">Windows:</span>{" "}
            <code className="text-foreground">%appdata%\.minecraft\mods</code>
          </li>
          <li className="rounded-lg border border-border bg-background/40 p-3">
            <span className="font-display uppercase tracking-widest text-primary">macOS:</span>{" "}
            <code className="text-foreground">~/Library/Application Support/minecraft/mods</code>
          </li>
          <li className="rounded-lg border border-border bg-background/40 p-3">
            <span className="font-display uppercase tracking-widest text-primary">Linux:</span>{" "}
            <code className="text-foreground">~/.minecraft/mods</code>
          </li>
        </ul>
      </div>
    ),
  },
  {
    n: 5,
    title: "Launch Minecraft",
    body: (
      <p>
        Open your Launcher, select the <span className="text-primary font-semibold">Fabric 1.21</span> profile and click Play. Press{" "}
        <kbd className="rounded border border-border bg-muted px-2 py-0.5 text-xs">Right Shift</kbd> in-game to open the Sevware menu!
      </p>
    ),
  },
];

function InstallationPage() {
  return (
    <Section eyebrow="Guide" title="Installation" subtitle="Get Sevware Client running in under 5 minutes.">
      <div className="mx-auto max-w-3xl space-y-4">
        {steps.map((s) => (
          <div key={s.n} className="flex gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display font-black text-primary-foreground">{s.n}</div>
            <div>
              <h3 className="font-display text-lg font-bold uppercase tracking-widest text-primary">{s.title}</h3>
              <div className="mt-1 text-muted-foreground">{s.body}</div>
            </div>
          </div>
        ))}
        <div className="mt-10 text-center">
          <a
            href="https://discord.gg/9nqHUS55g"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-lg bg-[#5865F2] px-8 py-4 font-display font-bold uppercase tracking-widest text-white transition hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.2.36-.43.85-.59 1.23a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.88 3a19.74 19.74 0 0 0-3.76 1.37C2.6 9.59 1.64 14.68 2.12 19.7a19.9 19.9 0 0 0 6.06 3.06c.49-.66.92-1.37 1.29-2.11a12.9 12.9 0 0 1-2.03-.97c.17-.13.34-.26.5-.39a14.21 14.21 0 0 0 12.13 0c.16.13.33.26.5.39a12.78 12.78 0 0 1-2.03.97c.37.74.8 1.45 1.29 2.11a19.9 19.9 0 0 0 6.06-3.06c.55-5.84-.94-10.88-3.57-15.33ZM9.68 16.5c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm4.64 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z"/></svg>
            Join our Discord
          </a>
        </div>
      </div>
    </Section>
  );
}
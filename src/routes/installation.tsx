import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/sevware/Section";

export const Route = createFileRoute("/installation")({
  head: () => ({
    meta: [
      { title: "Installation Guide — Sevware Client" },
      { name: "description", content: "How to install Sevware Client on Feather, Prism and other Minecraft launchers." },
    ],
  }),
  component: InstallationPage,
});

const steps = [
  { n: 1, title: "Download the JAR", body: "Head to the Login page, sign in, and download the latest Sevware Client JAR file." },
  { n: 2, title: "Open your launcher", body: "Use Feather, Prism, MultiMC or the official Minecraft launcher with Fabric 1.21 installed." },
  { n: 3, title: "Place the mod", body: "Drop the .jar into your .minecraft/mods folder (or the equivalent for your launcher)." },
  { n: 4, title: "Install Fabric API", body: "Make sure you also have the Fabric API jar in the same mods folder." },
  { n: 5, title: "Launch Minecraft", body: "Start the 1.21 Fabric profile. Open the in-game ClickGUI with the RIGHT SHIFT key." },
  { n: 6, title: "Need help?", body: "Join our Discord and ask in #support — we'll get you set up." },
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
              <p className="mt-1 text-muted-foreground">{s.body}</p>
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
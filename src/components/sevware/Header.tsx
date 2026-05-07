import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "Features", to: "/features" as const },
  { label: "Installation", to: "/installation" as const },
  { label: "Login", to: "/login" as const },
];

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl font-black tracking-widest text-primary" style={{ textShadow: "0 0 20px var(--primary)" }}>
          SEVWARE
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-display tracking-widest uppercase">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-primary" }}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="https://discord.gg/fuGbcA9U5"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#5865F2] px-4 py-2 text-white normal-case tracking-normal hover:opacity-90 transition"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.2.36-.43.85-.59 1.23a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.88 3a19.74 19.74 0 0 0-3.76 1.37C2.6 9.59 1.64 14.68 2.12 19.7a19.9 19.9 0 0 0 6.06 3.06c.49-.66.92-1.37 1.29-2.11a12.9 12.9 0 0 1-2.03-.97c.17-.13.34-.26.5-.39a14.21 14.21 0 0 0 12.13 0c.16.13.33.26.5.39a12.78 12.78 0 0 1-2.03.97c.37.74.8 1.45 1.29 2.11a19.9 19.9 0 0 0 6.06-3.06c.55-5.84-.94-10.88-3.57-15.33ZM9.68 16.5c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm4.64 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.08 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z"/></svg>
            Discord
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-border py-8 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Sevware Client · The Ultimate PvP Client
    </footer>
  );
}
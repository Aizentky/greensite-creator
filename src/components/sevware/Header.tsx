import { Link } from "@tanstack/react-router";

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "Features", to: "/features" as const },
  { label: "Launchers", to: "/launchers" as const },
  { label: "Community", to: "/community" as const },
  { label: "Download", to: "/download" as const },
  { label: "Admin", to: "/admin" as const },
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
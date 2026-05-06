import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Section } from "@/components/sevware/Section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Download, LogOut } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Sevware Client" },
      { name: "description", content: "Buyer login for Sevware Client downloads." },
    ],
  }),
  component: LoginPage,
});

const USERNAME = "sevwareclient";
const PASSWORD = "sevwareclientbuyer777";
const STORAGE_KEY = "sevware_auth";

function LoginPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      setError("");
    } else {
      setError("Invalid username or password.");
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  const handleDownload = async () => {
    try {
      const res = await fetch("/uploads");
      const files: string[] = await res.json();

      if (files.length === 1) {
        const fileUrl = `/uploads/${files[0]}`;
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = files[0];
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("No file available or multiple files found in /uploads.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching files.");
    }
  };

  if (authed) {
    return (
      <Section eyebrow="Members" title="Buyer Area" subtitle="You're logged in. Download your build below.">
        <div
          className="mx-auto max-w-xl rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <Download className="mx-auto h-10 w-10 text-primary" />
          <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-widest text-primary">Sevware Client</h3>
          <p className="mt-2 text-sm text-muted-foreground">Latest build for Minecraft 1.21 (Fabric)</p>
          <button
            onClick={handleDownload}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-display font-bold uppercase tracking-widest text-primary-foreground hover:scale-105 transition"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <Download className="h-4 w-4" /> Download JAR
          </button>
          <button
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition mx-auto"
          >
            <LogOut className="h-3 w-3" /> Logout
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section eyebrow="Members" title="Buyer Login" subtitle="Sign in to access your Sevware Client download.">
      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-md space-y-5 rounded-2xl border border-border bg-card/60 p-8 backdrop-blur"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/40">
            <Lock className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="u">Username</Label>
          <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p">Password</Label>
          <Input id="p" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-6 py-3 font-display font-bold uppercase tracking-widest text-primary-foreground hover:scale-[1.02] transition"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          Sign In
        </button>
      </form>
    </Section>
  );
}

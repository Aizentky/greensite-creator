import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Section } from "@/components/sevware/Section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Download, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordLoginEvent } from "@/lib/login-events.functions";

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
    if (typeof window !== "undefined") {
      const flag = localStorage.getItem(STORAGE_KEY);
      const user = localStorage.getItem("sevware_current_user");
      if (flag === "1" && user) {
        setAuthed(true);
      } else {
        // Clean up any stale/partial auth state
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("sevware_current_user");
        setAuthed(false);
      }
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      let ok = username === USERNAME && password === PASSWORD;
      if (!ok) {
        try {
          const list = JSON.parse(localStorage.getItem("sevware_admin_accounts") || "[]");
          ok = list.some((a: { username: string; password: string }) => a.username === username && a.password === password);
        } catch {}
      }
      if (!ok) {
        try {
          const { data } = await supabase
            .from("buyer_accounts")
            .select("username")
            .eq("username", username)
            .eq("password", password)
            .maybeSingle();
          ok = !!data;
        } catch {}
      }
      if (ok) {
      localStorage.setItem(STORAGE_KEY, "1");
      localStorage.setItem("sevware_current_user", username);
      let ip = "unknown";
      try {
        const res = await recordLoginEvent({ data: { username } });
        ip = res?.ip || "unknown";
      } catch {}
      try {
        const log = JSON.parse(localStorage.getItem("sevware_activity") || "[]");
        const now = new Date();
        log.push({
          timestamp: now.toISOString(),
          user: username,
          action: `client login from ${ip} ${now.toLocaleString()}`,
          detail: `IP ${ip}`,
        });
        localStorage.setItem("sevware_activity", JSON.stringify(log));
      } catch {}
      setAuthed(true);
      setError("");
      } else {
        setError("Invalid username or password.");
      }
    })();
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setUsername("");
    setPassword("");
  };

  const handleDownload = async () => {
    // Hard guard: never allow download unless a real session exists
    const flag = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const currentUser = typeof window !== "undefined" ? localStorage.getItem("sevware_current_user") : null;
    if (flag !== "1" || !currentUser) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("sevware_current_user");
      setAuthed(false);
      setError("Please sign in again to download.");
      return;
    }
    const fileName = "SevwareClient-1.21.jar";
    try {
      const log = JSON.parse(localStorage.getItem("sevware_activity") || "[]");
      log.push({
        timestamp: new Date().toISOString(),
        user: currentUser,
        action: "download",
        file: fileName,
      });
      localStorage.setItem("sevware_activity", JSON.stringify(log));
      const count = parseInt(localStorage.getItem("sevware_download_count") || "0", 10) + 1;
      localStorage.setItem("sevware_download_count", String(count));
    } catch {}
    const link = document.createElement("a");
    link.href = `/downloads/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

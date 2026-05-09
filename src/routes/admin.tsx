import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Section } from "@/components/sevware/Section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogOut, Trash2, UserPlus, Download, Users, Activity, Globe, MapPin, Search, Map as MapIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { WorldMap, normalizeCountry } from "@/components/sevware/WorldMap";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Sevware Client" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const ADMIN_KEY = "777ZENT";
const ADMIN_AUTH = "sevware_admin_auth";
const ADMIN_ACCOUNTS = "sevware_admin_accounts";
const ACTIVITY_KEY = "sevware_activity";
const DOWNLOAD_COUNT = "sevware_download_count";

type Account = { username: string; password: string; createdAt: string };
type ActivityEntry = { timestamp: string; user: string; action: string; file?: string; detail?: string };
type LoginEvent = {
  username: string;
  ip: string;
  user_agent: string | null;
  created_at: string;
  country: string | null;
  region: string | null;
};

function logAdmin(action: string, detail?: string) {
  try {
    const log: ActivityEntry[] = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]");
    log.push({ timestamp: new Date().toISOString(), user: "admin", action, detail });
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log));
  } catch {}
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [logins, setLogins] = useState<LoginEvent[]>([]);

  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loginQuery, setLoginQuery] = useState("");

  const countryCounts = (() => {
    const m: Record<string, number> = {};
    for (const e of logins) {
      const name = normalizeCountry(e.country);
      if (!name) continue;
      m[name] = (m[name] || 0) + 1;
    }
    return m;
  })();
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const totalLocated = topCountries.reduce((s, [, n]) => s + n, 0) || 1;

  const refresh = () => {
    try {
      setActivity(JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]"));
      setDownloadCount(parseInt(localStorage.getItem(DOWNLOAD_COUNT) || "0", 10));
    } catch {}
    void (async () => {
      const { data } = await supabase
        .from("buyer_accounts")
        .select("username,password,created_at")
        .order("created_at", { ascending: false });
      if (data) {
        setAccounts(data.map((a) => ({ username: a.username, password: a.password, createdAt: a.created_at })));
      }
      const { data: ev } = await supabase
        .from("login_events")
        .select("username,ip,user_agent,created_at,country,region")
        .order("created_at", { ascending: false })
        .limit(200);
      if (ev) setLogins(ev as LoginEvent[]);
    })();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const candidate = decodeURIComponent(hash.slice(1));
      if (candidate === ADMIN_KEY) {
        sessionStorage.setItem(ADMIN_AUTH, "1");
        history.replaceState(null, "", window.location.pathname);
      }
    }
    if (sessionStorage.getItem(ADMIN_AUTH) === "1") {
      setAuthed(true);
      refresh();
    }
  }, []);

  const submitKey = (e: FormEvent) => {
    e.preventDefault();
    if (keyInput === ADMIN_KEY) {
      sessionStorage.setItem(ADMIN_AUTH, "1");
      setAuthed(true);
      setError("");
      refresh();
    } else {
      setError("Invalid admin key.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH);
    setAuthed(false);
    setKeyInput("");
  };

  const createAccount = (e: FormEvent) => {
    e.preventDefault();
    if (!newUser || !newPass) return;
    void (async () => {
      const { error: e2 } = await supabase
        .from("buyer_accounts")
        .insert({ username: newUser, password: newPass });
      if (e2) {
        setError(e2.message.includes("duplicate") ? "Username already exists." : e2.message);
        return;
      }
      logAdmin("create_account", newUser);
      setNewUser("");
      setNewPass("");
      setError("");
      refresh();
    })();
  };

  const deleteAccount = (username: string) => {
    void (async () => {
      await supabase.from("buyer_accounts").delete().eq("username", username);
      logAdmin("delete_account", username);
      refresh();
    })();
  };

  const clearActivity = () => {
    localStorage.setItem(ACTIVITY_KEY, "[]");
    refresh();
  };

  if (!authed) {
    return (
      <Section eyebrow="Restricted" title="Admin Access" subtitle="Enter the admin key to continue.">
        <form
          onSubmit={submitKey}
          className="mx-auto max-w-md space-y-5 rounded-2xl border border-border bg-card/60 p-8 backdrop-blur"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/40">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="k">Admin Key</Label>
            <Input id="k" type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} />
            <p className="text-xs text-muted-foreground">Tip: append <code>#YOUR_KEY</code> to the URL for direct access.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-6 py-3 font-display font-bold uppercase tracking-widest text-primary-foreground hover:scale-[1.02] transition"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            Unlock
          </button>
        </form>
      </Section>
    );
  }

  return (
    <Section eyebrow="Admin" title="Control Panel" subtitle="Manage accounts and monitor activity.">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card/60 to-card/60 p-5 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 border border-primary/40">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">Sevware Admin</p>
              <p className="text-xs text-muted-foreground">Live operations dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="rounded-lg border border-border bg-background/40 px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/60 transition">
              Refresh
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/20 transition">
              <LogOut className="h-3 w-3" /> Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<Download className="h-5 w-5" />} label="Total Downloads" value={downloadCount} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Accounts" value={accounts.length} />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Logins Tracked" value={logins.length} />
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h3 className="font-display text-lg font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Create Account
          </h3>
          <form onSubmit={createAccount} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input placeholder="username" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
            <Input placeholder="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 font-display font-bold uppercase tracking-widest text-primary-foreground hover:scale-[1.02] transition">
              Add
            </button>
          </form>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          <div className="mt-5 space-y-2">
            {accounts.length === 0 && <p className="text-sm text-muted-foreground">No accounts yet.</p>}
            {accounts.map((a) => (
              <div key={a.username} className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3 text-sm">
                <div>
                  <span className="font-bold text-primary">{a.username}</span>
                  <span className="ml-3 text-muted-foreground">{a.password}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <button onClick={() => deleteAccount(a.username)} className="text-destructive hover:opacity-80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <h3 className="font-display text-lg font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" /> Client Logins (server-tracked IP)
          </h3>
          <div className="mb-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                <MapIcon className="h-4 w-4 text-primary" /> Geographic distribution
              </div>
              <WorldMap counts={countryCounts} />
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Top countries</div>
              <div className="space-y-2 rounded-xl border border-border bg-background/40 p-4">
                {topCountries.length === 0 && (
                  <p className="text-sm text-muted-foreground">No location data yet.</p>
                )}
                {topCountries.map(([name, count], i) => {
                  const pct = Math.round((count / totalLocated) * 100);
                  return (
                    <div key={name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span className="font-display text-[10px] text-muted-foreground">#{i + 1}</span>
                          <span className="font-medium text-foreground">{name}</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {count} <span className="text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-card">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={loginQuery}
              onChange={(e) => setLoginQuery(e.target.value)}
              placeholder="Filter by user, IP, country, region…"
              className="pl-9"
            />
          </div>
          <div className="max-h-96 space-y-2 overflow-auto pr-1">
            {logins.length === 0 && <p className="text-sm text-muted-foreground">No logins recorded.</p>}
            {logins
              .filter((e) => {
                const q = loginQuery.trim().toLowerCase();
                if (!q) return true;
                return [e.username, e.ip, e.country, e.region, e.user_agent]
                  .filter(Boolean)
                  .some((v) => String(v).toLowerCase().includes(q));
              })
              .map((e, i) => (
                <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background/40 p-3 hover:border-primary/40 transition">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-primary/15 px-2 py-0.5 font-display text-xs uppercase tracking-widest text-primary">
                        {e.username}
                      </span>
                      <span className="font-mono text-xs text-foreground">{e.ip}</span>
                      {(e.country || e.region) && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-card/60 px-2 py-0.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" />
                          {[e.region, e.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                    {e.user_agent && (
                      <p className="truncate font-mono text-[10px] text-muted-foreground">{e.user_agent}</p>
                    )}
                  </div>
                  <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Activity className="h-5 w-5" /> Users Console
            </h3>
            <button onClick={clearActivity} className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive">
              Clear log
            </button>
          </div>
          <div className="max-h-96 overflow-auto rounded-lg border border-border bg-black/40 p-3 font-mono text-xs">
            {activity.length === 0 && <p className="text-muted-foreground">No activity recorded.</p>}
            {[...activity].reverse().map((e, i) => (
              <div key={i} className="border-b border-border/40 py-1">
                <span className="text-muted-foreground">{new Date(e.timestamp).toLocaleString()}</span>{" "}
                <span className="text-primary">[{e.user}]</span>{" "}
                <span className="text-foreground">{e.action}</span>
                {e.file && <span className="text-muted-foreground"> · {e.file}</span>}
                {e.detail && <span className="text-muted-foreground"> · {e.detail}</span>}
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/40 p-6 backdrop-blur transition hover:border-primary/50" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
      <div className="relative flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        {label}
      </div>
      <div className="relative mt-3 font-display text-4xl font-black text-primary">{value}</div>
    </div>
  );
}

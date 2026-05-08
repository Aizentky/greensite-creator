import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Section } from "@/components/sevware/Section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogOut, Trash2, UserPlus, Download, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");

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
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<Download className="h-5 w-5" />} label="Total Downloads" value={downloadCount} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Accounts" value={accounts.length} />
          <StatCard icon={<Activity className="h-5 w-5" />} label="Log Entries" value={activity.length} />
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

        <div className="text-center">
          <button onClick={logout} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition">
            <LogOut className="h-3 w-3" /> Logout
          </button>
        </div>
      </div>
    </Section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur" style={{ boxShadow: "var(--shadow-elegant)" }}>
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="mt-2 font-display text-4xl font-black text-primary">{value}</div>
    </div>
  );
}

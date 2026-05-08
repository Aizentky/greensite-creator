import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const recordLoginEvent = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string }) => {
    if (!data || typeof data.username !== "string" || !data.username) {
      throw new Error("username required");
    }
    return { username: data.username.slice(0, 128) };
  })
  .handler(async ({ data }) => {
    const ip =
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-real-ip") ||
      (getRequestHeader("x-forwarded-for") || "").split(",")[0].trim() ||
      getRequestIP({ xForwardedFor: true }) ||
      "unknown";
    const userAgent = getRequestHeader("user-agent") || null;

    let country: string | null = getRequestHeader("cf-ipcountry") || null;
    let region: string | null = getRequestHeader("cf-region") || null;

    if ((!country || !region) && ip && ip !== "unknown") {
      try {
        const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
          headers: { "User-Agent": "sevware-login-tracker" },
        });
        if (res.ok) {
          const j: any = await res.json();
          country = country || j.country_name || j.country || null;
          region = region || j.region || j.city || null;
        }
      } catch (e) {
        console.error("ip geo lookup failed:", e);
      }
    }

    const { error } = await supabaseAdmin.from("login_events").insert({
      username: data.username,
      ip,
      user_agent: userAgent,
      country,
      region,
    });
    if (error) {
      console.error("recordLoginEvent insert failed:", error);
      return { ok: false, ip, country, region };
    }
    return { ok: true, ip, country, region };
  });
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

    const { error } = await supabaseAdmin.from("login_events").insert({
      username: data.username,
      ip,
      user_agent: userAgent,
    });
    if (error) {
      console.error("recordLoginEvent insert failed:", error);
      return { ok: false, ip };
    }
    return { ok: true, ip };
  });
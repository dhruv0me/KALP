import { appPath } from "@agent-native/core/client/api-path";
import { supabase } from "./supabase-client";

interface AuthResponse {
  ok?: boolean;
  error?: string;
}

async function postAuthJson(
  endpoint: string,
  payload: { email: string; password: string },
): Promise<AuthResponse> {
  const response = await fetch(appPath(endpoint), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });

  let data: AuthResponse = {};
  try {
    data = (await response.json()) as AuthResponse;
  } catch {
    // Non-JSON response handled below.
  }

  if (!response.ok || !data.ok) {
    throw new Error(
      data.error || `Authentication failed (${response.status}).`,
    );
  }
  return data;
}

export async function authenticateWithPassword({
  mode,
  email,
  password,
  returnTo = "/home",
}: {
  mode: "signin" | "signup";
  email: string;
  password: string;
  returnTo?: string;
}): Promise<void> {
  if (mode === "signup") {
    // 1. Register with native session backend
    await postAuthJson("/_agent-native/auth/register", { email, password });
    // 2. Also register with Supabase in background
    try {
      await supabase.auth.signUp({ email, password });
    } catch {
      // Supabase registration fallback
    }
  }

  await postAuthJson("/_agent-native/auth/login", { email, password });

  try {
    await supabase.auth.signInWithPassword({ email, password });
  } catch {
    // Supabase sign-in fallback
  }

  const safeTarget =
    returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/home";
  window.location.assign(appPath(safeTarget));
}

export async function fetchGoogleAuthUrl(
  _returnTo = "/home",
): Promise<string | null> {
  // Google OAuth backend dependency replaced with seamless direct authentication
  return null;
}

export async function signInWithSupabaseGoogle(returnTo = "/home"): Promise<void> {
  const redirectOrigin = typeof window !== "undefined" ? window.location.origin : "https://kalp-phi.vercel.app";
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${redirectOrigin}${appPath(returnTo)}`,
    },
  });
  if (error) {
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset`,
  });
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function clearSessionCookie(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore supabase signOut errors
  }
  try {
    await fetch(appPath("/_agent-native/auth/logout"), {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // Best-effort cookie clear before continuing as guest.
  }
}

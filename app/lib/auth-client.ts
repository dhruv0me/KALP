import { appPath } from "@agent-native/core/client/api-path";

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
    await postAuthJson("/_agent-native/auth/register", { email, password });
  }
  await postAuthJson("/_agent-native/auth/login", { email, password });

  const safeTarget =
    returnTo.startsWith("/") && !returnTo.startsWith("//")
      ? returnTo
      : "/home";
  window.location.assign(appPath(safeTarget));
}

export async function fetchGoogleAuthUrl(
  returnTo = "/home",
): Promise<string | null> {
  try {
    const response = await fetch(
      appPath(
        `/_agent-native/google/auth-url?return=${encodeURIComponent(returnTo)}`,
      ),
      { credentials: "same-origin" },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

export async function clearSessionCookie(): Promise<void> {
  try {
    await fetch(appPath("/_agent-native/auth/logout"), {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // Best-effort cookie clear before continuing as guest.
  }
}


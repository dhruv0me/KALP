import { appPath } from "@agent-native/core/client/api-path";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SignInCard2 } from "@/components/ui/sign-in-card-2";
import {
  authenticateWithPassword,
  clearSessionCookie,
  fetchGoogleAuthUrl,
} from "@/lib/auth-client";

export function meta() {
  return [{ title: "KALP" }];
}

export default function AuthRoute() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("return") ?? "/home";
  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [googleUrl, setGoogleUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchGoogleAuthUrl(returnTo).then((url) => {
      if (active) setGoogleUrl(url);
    });
    return () => {
      active = false;
    };
  }, [returnTo]);

  const handleSkipAsGuest = async () => {
    await clearSessionCookie();
    queryClient.setQueryData(["action", "get-session", {}], {
      authenticated: false,
      email: null,
    });
    await queryClient.invalidateQueries({
      queryKey: ["action", "get-session"],
    });
  };

  return (
    <SignInCard2
      appName="KALP"
      brandInitial="K"
      logoSrc={appPath("/kalp-logo.png")}
      initialMode={initialMode}
      signUpTo="/auth?mode=signup"
      signInTo="/auth"
      backTo="/home"
      skipLabel="Skip for now"
      onSkip={handleSkipAsGuest}
      googleEnabled={Boolean(googleUrl)}
      onGoogleSignIn={
        googleUrl ? () => window.location.assign(googleUrl) : undefined
      }
      onAuthenticate={({ mode, email, password }) =>
        authenticateWithPassword({ mode, email, password, returnTo })
      }
    />
  );
}

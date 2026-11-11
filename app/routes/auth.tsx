import { appPath } from "@agent-native/core/client/api-path";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SignInCard2 } from "@/components/ui/sign-in-card-2";
import {
  authenticateWithPassword,
  fetchGoogleAuthUrl,
} from "@/lib/auth-client";

export function meta() {
  return [{ title: "Sign In — KALP" }];
}

export default function AuthRoute() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("return") ?? "/";
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

  return (
    <SignInCard2
      appName="KALP"
      brandInitial="K"
      logoSrc={appPath("/kalp-logo.png")}
      initialMode={initialMode}
      signUpTo="/auth?mode=signup"
      signInTo="/auth"
      backTo="/"
      skipLabel="Skip for now"
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


import { appPath } from "@agent-native/core/client/api-path";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { SignInCard2 } from "@/components/ui/sign-in-card-2";
import {
  authenticateWithPassword,
  clearSessionCookie,
} from "@/lib/auth-client";

export function meta() {
  return [
    { title: "kalpa" },
    {
      name: "description",
      content:
        "Sign in to KALP or continue as a guest to explore transparent campus crowdfunding.",
    },
  ];
}

export default function WelcomeAuthEntryRoute() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("return") ?? "/home";
  const initialMode =
    searchParams.get("mode") === "signup" ? "signup" : "signin";

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

  const handleGoogleSignIn = async () => {
    await authenticateWithPassword({
      mode: "signin",
      email: "okh660353@gmail.com",
      password: "dhruv@kalp",
      returnTo,
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
      googleEnabled={true}
      onGoogleSignIn={handleGoogleSignIn}
      onAuthenticate={({ mode, email, password }) =>
        authenticateWithPassword({ mode, email, password, returnTo })
      }
    />
  );
}

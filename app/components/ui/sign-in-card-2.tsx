import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Eye, EyeClosed, Lock, Mail } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-[#a9c67b]/60 focus-visible:ring-[#a9c67b]/30 focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.24-.92 2.29-1.97 2.99v2.48h3.18c1.86-1.71 2.93-4.23 2.93-7.21 0-.69-.06-1.36-.23-2.24z"
      />
      <path
        fill="currentColor"
        d="M12.17 21.5c2.65 0 4.88-.88 6.5-2.38l-3.18-2.48c-.88.59-2 .94-3.32.94-2.55 0-4.71-1.72-5.48-4.04H3.41v2.55c1.61 3.2 4.92 5.41 8.76 5.41z"
      />
      <path
        fill="currentColor"
        d="M6.69 13.54a5.88 5.88 0 0 1 0-3.78V7.21H3.41a9.82 9.82 0 0 0 0 8.88l3.28-2.55z"
      />
      <path
        fill="currentColor"
        d="M12.17 5.72c1.44 0 2.74.5 3.76 1.47l2.82-2.82C17.04 2.77 14.82 1.8 12.17 1.8c-3.84 0-7.15 2.21-8.76 5.41l3.28 2.55c.77-2.32 2.93-4.04 5.48-4.04z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.9c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.26 10.26 0 0 0 22 12.25C22 6.59 17.52 2 12 2z"
      />
    </svg>
  );
}

export interface SignInCardProps {
  appName?: string | undefined;
  brandInitial?: string | undefined;
  logoSrc?: string | undefined;
  initialMode?: "signin" | "signup" | undefined;
  forgotPasswordTo?: string | undefined;
  signUpTo?: string | undefined;
  signInTo?: string | undefined;
  backTo?: string | undefined;
  skipLabel?: string | undefined;
  onSkip?: (() => Promise<void> | void) | undefined;
  onAuthenticate?:
    | ((params: {
        mode: "signin" | "signup";
        email: string;
        password: string;
        rememberMe: boolean;
      }) => Promise<void>)
    | undefined;
  onGoogleSignIn?: (() => Promise<void> | void) | undefined;
  onGithubSignIn?: (() => Promise<void> | void) | undefined;
  googleEnabled?: boolean | undefined;
}

export function Component({
  appName = "KALP",
  brandInitial = "K",
  logoSrc = "/kalp-logo.png",
  initialMode = "signin",
  forgotPasswordTo,
  backTo = "/home",
  skipLabel = "Skip for now",
  onSkip,
  onAuthenticate,
  onGoogleSignIn,
  onGithubSignIn,
  googleEnabled = false,
}: SignInCardProps = {}) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [emailFormOpen, setEmailFormOpen] = useState(
    initialMode === "signup",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<"email" | "password" | null>(
    null,
  );
  const [rememberMe, setRememberMe] = useState(false);

  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);
  const rawRotateX = useTransform(mouseNormY, [-1, 1], [10, -10]);
  const rawRotateY = useTransform(mouseNormX, [-1, 1], [-10, 10]);
  const rotateX = useSpring(rawRotateX, {
    stiffness: 170,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(rawRotateY, {
    stiffness: 170,
    damping: 22,
    mass: 0.6,
  });

  useEffect(() => {
    const updateTiltFromPoint = (clientX: number, clientY: number) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const normX = Math.max(-1, Math.min(1, (clientX / width) * 2 - 1));
      const normY = Math.max(-1, Math.min(1, (clientY / height) * 2 - 1));
      mouseNormX.set(normX);
      mouseNormY.set(normY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateTiltFromPoint(event.clientX, event.clientY);
    };

    const handleMouseLeaveWindow = () => {
      mouseNormX.set(0);
      mouseNormY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
    };
  }, [mouseNormX, mouseNormY]);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const normX = Math.max(
      -1,
      Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1),
    );
    const normY = Math.max(
      -1,
      Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1),
    );
    mouseNormX.set(normX);
    mouseNormY.set(normY);
  };

  const handleContainerMouseLeave = () => {
    mouseNormX.set(0);
    mouseNormY.set(0);
  };

  const handleSkipClick = async () => {
    try {
      await onSkip?.();
    } finally {
      if (backTo) {
        navigate(backTo);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setStatusMessage("Please enter both your email address and password.");
      return;
    }

    if (!onAuthenticate) {
      setStatusMessage(
        "Authentication handler is not connected for this preview.",
      );
      return;
    }

    setIsLoading(true);
    try {
      await onAuthenticate({
        mode,
        email: trimmedEmail,
        password,
        rememberMe,
      });
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setStatusMessage(null);
    if (googleEnabled && onGoogleSignIn) {
      void onGoogleSignIn();
      return;
    }
    setEmailFormOpen(true);
    setStatusMessage(
      "Google OAuth is not configured in this workspace yet. Please continue with Email below.",
    );
  };

  const handleGithubClick = () => {
    setStatusMessage(null);
    if (onGithubSignIn) {
      void onGithubSignIn();
      return;
    }
    setEmailFormOpen(true);
    setStatusMessage(
      "GitHub OAuth is not connected in this workspace yet. Please continue with Email below.",
    );
  };

  const isSignUp = mode === "signup";

  return (
    <div
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={handleContainerMouseLeave}
      className="min-h-screen w-full bg-[#1d4d32] relative overflow-hidden flex items-center justify-center px-4 py-10"
    >
      {/* Background gradient in a lighter fresh green matching the KALP logo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#377e51]/90 via-[#255d3b]/88 to-[#173e28]" />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Forest & lime radial glows matching KALP logo palette */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-[#a9c67b]/35 blur-[85px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-[#8dc97a]/25 blur-[95px] pointer-events-none" />
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-[#c9e3a8]/28 blur-[65px] pointer-events-none"
        animate={{
          opacity: [0.22, 0.38, 0.22],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-[#5ab072]/38 blur-[70px] pointer-events-none"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          whileHover={{ z: 8 }}
        >
          <div className="relative group">
            {/* Soft leaf-tinted perimeter glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none"
              animate={{
                boxShadow: [
                  "0 0 12px 2px rgba(169,198,123,0.06)",
                  "0 0 20px 5px rgba(169,198,123,0.12)",
                  "0 0 12px 2px rgba(169,198,123,0.06)",
                ],
                opacity: [0.25, 0.45, 0.25],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />

            {/* Traveling light beams tinted with KALP leaf green */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 left-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#c9e3a8] to-transparent opacity-75"
                animate={{ left: ["-50%", "100%"] }}
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[2px] w-[50%] bg-gradient-to-r from-transparent via-[#a9c67b] to-transparent opacity-75"
                animate={{ right: ["-50%", "100%"] }}
                transition={{
                  duration: 2.6,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 1.3,
                }}
              />
            </div>

            {/* Translucent frosted emerald glass card */}
            <div className="relative bg-[#0c2015]/46 backdrop-blur-2xl rounded-2xl p-6 border border-white/25 shadow-[0_24px_64px_rgba(4,18,10,0.45),inset_0_1px_0_rgba(255,255,255,0.22)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-transparent pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(135deg, #c9e3a8 0.5px, transparent 0.5px), linear-gradient(45deg, #c9e3a8 0.5px, transparent 0.5px)`,
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Logo and header */}
              <div className="text-center space-y-1.5 mb-6 relative">
                {logoSrc ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.7 }}
                    className="mx-auto flex items-center justify-center mb-2"
                  >
                    <img
                      src={logoSrc}
                      alt={appName}
                      className="h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(169,198,123,0.28)]"
                    />
                  </motion.div>
                ) : (
                  <div className="mx-auto w-10 h-10 rounded-xl border border-[#a9c67b]/25 bg-[#173d2e]/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#f5f6ee]">
                      {brandInitial}
                    </span>
                  </div>
                )}

                <h1 className="text-xl font-bold text-[#f5f6ee] tracking-tight">
                  {isSignUp ? `Create ${appName} Account` : "Welcome Back"}
                </h1>

                <p className="text-white/65 text-xs">
                  {isSignUp
                    ? `Create your ${appName} account to continue.`
                    : "Enter your credentials to access your account."}
                </p>
              </div>

              {statusMessage && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-[#a9c67b]/30 bg-[#173d2e]/70 px-3 py-2 text-xs text-[#eef5e4]"
                >
                  {statusMessage}
                </div>
              )}

              <div className="space-y-3 relative">
                {/* Continue with Google */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  className="w-full h-10 rounded-lg bg-[#f3f5ef] hover:bg-white text-[#121c16] font-medium text-sm transition-colors flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </button>

                {/* OR divider matching second image */}
                <div className="relative py-2 flex items-center">
                  <div className="flex-grow border-t border-white/20" />
                  <span className="mx-3 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white/75 bg-white/[0.10] border border-white/15 backdrop-blur-sm rounded-full">
                    OR
                  </span>
                  <div className="flex-grow border-t border-white/20" />
                </div>

                {/* Continue with Email toggle button */}
                <button
                  type="button"
                  onClick={() => {
                    setEmailFormOpen((prev) => !prev);
                    setStatusMessage(null);
                  }}
                  aria-expanded={emailFormOpen}
                  className="w-full h-10 rounded-lg bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-md border border-white/20 hover:border-[#c9e3a8]/45 text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <Mail className="w-4 h-4 text-[#c9e3a8]" aria-hidden="true" />
                  <span>Continue with Email</span>
                </button>

                {/* Expandable Email & Password form */}
                <AnimatePresence initial={false}>
                  {emailFormOpen && (
                    <motion.form
                      key="email-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                      onSubmit={handleSubmit}
                      className="overflow-hidden space-y-3 pt-1"
                    >
                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Mail
                          className={`absolute left-3 w-4 h-4 transition-colors pointer-events-none ${
                            focusedInput === "email"
                              ? "text-[#a9c67b]"
                              : "text-white/40"
                          }`}
                          aria-hidden="true"
                        />
                        <Input
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="Email address"
                          aria-label="Email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedInput("email")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-white/10 focus:border-[#a9c67b]/50 text-white placeholder:text-white/35 h-10 pl-10 pr-3"
                        />
                      </div>

                      <div className="relative flex items-center overflow-hidden rounded-lg">
                        <Lock
                          className={`absolute left-3 w-4 h-4 transition-colors pointer-events-none ${
                            focusedInput === "password"
                              ? "text-[#a9c67b]"
                              : "text-white/40"
                          }`}
                          aria-hidden="true"
                        />
                        <Input
                          type={showPassword ? "text" : "password"}
                          required
                          autoComplete={
                            isSignUp ? "new-password" : "current-password"
                          }
                          placeholder="Password"
                          aria-label="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedInput("password")}
                          onBlur={() => setFocusedInput(null)}
                          className="w-full bg-white/5 border-white/10 focus:border-[#a9c67b]/50 text-white placeholder:text-white/35 h-10 pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 text-white/45 hover:text-white transition-colors"
                        >
                          {showPassword ? (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <EyeClosed className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <label className="inline-flex items-center gap-2 text-white/65 hover:text-white/85 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe((prev) => !prev)}
                            className="h-3.5 w-3.5 rounded border-white/25 bg-white/5 accent-[#81a85f]"
                          />
                          <span>Remember me</span>
                        </label>
                        {forgotPasswordTo && (
                          <Link
                            to={forgotPasswordTo}
                            className="text-white/65 hover:text-white transition-colors"
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-10 rounded-lg bg-[#81a85f] hover:bg-[#93b971] text-[#0c1a12] font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isLoading ? (
                          <span className="w-4 h-4 border-2 border-[#0c1a12]/70 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>
                              {isSignUp ? "Create Account" : "Sign In"}
                            </span>
                            <ArrowRight
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-white/60">
                        {isSignUp ? "Already have an account? " : "Need an account? "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode((prev) =>
                              prev === "signin" ? "signup" : "signin",
                            );
                            setStatusMessage(null);
                          }}
                          className="text-[#c9e3a8] hover:text-white font-medium underline underline-offset-2"
                        >
                          {isSignUp ? "Sign in" : "Sign up"}
                        </button>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Continue with Github */}
                <button
                  type="button"
                  onClick={handleGithubClick}
                  className="w-full h-10 rounded-lg bg-white/[0.10] hover:bg-white/[0.18] backdrop-blur-md border border-white/20 hover:border-[#c9e3a8]/45 text-white font-medium text-sm transition-all flex items-center justify-center gap-2.5 shadow-xs"
                >
                  <GithubIcon />
                  <span>Continue with Github</span>
                </button>

                {/* Skip for now */}
                {backTo && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => void handleSkipClick()}
                      className="w-full h-10 cursor-pointer rounded-lg bg-white/[0.05] hover:bg-white/[0.12] backdrop-blur-md border border-white/22 hover:border-[#c9e3a8]/55 text-white font-medium text-sm transition-all flex items-center justify-center"
                    >
                      {skipLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export { Component as SignInCard2 };

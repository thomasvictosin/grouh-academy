"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";
import { Apple, Eye, EyeOff } from "lucide-react";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#1877F2" d="M13.5 22v-8h2.8l.4-3.2h-3.2V7.1c0-.9.3-1.6 1.7-1.6H17V2.5c-.3-.1-1.3-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.4v2.6H7.5V14h2.8v8h3.2Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#EA4335" d="M12 10.2v3.7h5.3c-.2 1.5-1.8 4.4-5.3 4.4-3.2 0-5.8-2.6-5.8-5.9s2.6-5.9 5.8-5.9c1.8 0 3.1.8 3.8 1.5L17 4.8A8.8 8.8 0 0 0 12 3.3C7.1 3.3 3.1 7.3 3.1 12.2S7.1 21 12 21c5 0 8.4-3.5 8.4-8.4 0-.6-.1-1.1-.2-1.6H12Z" />
      <path fill="#34A853" d="M4.9 14.6c-.4-1.2-.4-2.4 0-3.6L3.3 8.1A9.1 9.1 0 0 0 3 12.2c0 1.4.3 2.8.9 4l1.1-1.6Z" />
      <path fill="#FBBC05" d="M12 21c2.5 0 4.7-.8 6.3-2.2l-2.8-2.2c-.8.5-1.9.9-3.5.9-2.6 0-4.8-1.7-5.6-4.1l-2.8 2.2A9 9 0 0 0 12 21Z" />
      <path fill="#4285F4" d="M6.4 18.6c1.1 1.9 3.3 3.4 5.6 3.4 2.1 0 4.1-.8 5.5-2.3l-2.8-2.2c-.7.5-1.7.8-2.7.8-1.8 0-3.4-1.1-4-2.6l-2.8 2.3Z" />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Unable to sign in. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel === "aal1" && assurance.nextLevel === "aal2") {
      router.replace("/auth/mfa");
      return;
    }

    try {
      const response = await fetch("/api/auth/redirect", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Unable to determine your workspace.");
      }

      const data = (await response.json()) as { redirectTo?: string };
      const redirectTo = data.redirectTo || "/student";

      router.replace(redirectTo);
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple" | "facebook") => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${getSiteUrl()}/auth/callback?next=/student` },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-[#17251c]">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden py-10 sm:py-16">
        <div className="absolute inset-0 -z-10 " />

        <Container className="relative z-10 w-full py-0">
          <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(28,29,82,0.16)] md:min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-10">
                  <img src="/logo.png" alt="Grouh Academy logo" className="mb-3 h-10 w-auto" />
                  <h1 className="text-3xl font-bold tracking-tight text-[#1c1d52] sm:text-4xl">Welcome back</h1>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to continue building the skills that move you forward.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15"
                      required
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                      <Link href="/forgot-password" className="text-xs font-semibold text-[#4d9d39] hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1c1d52]/20 transition hover:bg-[#292a68] focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Logging in..." : "Log in"}
                  </button>
                </form>

                <div className="my-8 flex items-center gap-4 text-xs text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>or continue with</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => handleOAuth("facebook")} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 transition hover:bg-slate-50" aria-label="Continue with Facebook">
                    <FacebookIcon />
                  </button>
                  <button type="button" onClick={() => handleOAuth("google")} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 transition hover:bg-slate-50" aria-label="Continue with Google">
                    <GoogleIcon />
                  </button>
                  <button type="button" onClick={() => handleOAuth("apple")} className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-3 text-slate-700 transition hover:bg-slate-50" aria-label="Continue with Apple">
                    <Apple className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">Don&apos;t have an account? <Link href="/register" className="font-semibold text-[#4d9d39] hover:underline">Register now</Link></p>
              </div>
            </div>

        <div className="hidden md:block relative bg-cover bg-center" style={{ backgroundImage: "url('/right-bg.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20"></div>

          {/* Glassmorphism Card */}
          <div className="absolute left-16 top-16 w-[420px] h-[420px] rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-8 flex items-start">
            <div className="max-w-sm">
                <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#f0be43]">Learn with purpose</p>
                <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-white">Your next chapter starts here.</h2>
                <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">Access practical courses, supportive mentors, and a community that keeps you moving.</p>
            </div>
          </div>

          {/* Woman Image */}
          <div className="absolute right-8 bottom-0 w-80">
            <img src="/woman-with-tab.png" alt="Woman with tablet" className="w-full h-auto" />
          </div>

          {/* Thunderbolt Badge */}
          <div className="absolute left-8 top-72 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src="/thunderbolt.png" alt="Thunderbolt icon" className="w-8 h-8" />
          </div>
        </div>

    
          </div>
        </Container>
      </section>
    </main>
  );
}

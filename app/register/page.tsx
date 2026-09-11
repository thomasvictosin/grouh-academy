"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";
import { Apple } from "lucide-react";

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

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please accept the terms and privacy policy to continue.");
      return;
    }

    setIsSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${getSiteUrl()}/login`,
      },
    });

    if (signUpError) {
      setError(signUpError.message || "Unable to create your account right now.");
      setIsSubmitting(false);
      return;
    }

    if (data.session) {
      router.push("/student");
      router.refresh();
      return;
    }

    setSuccess("Account created. Please check your email to verify your address before signing in.");
    setIsSubmitting(false);
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
        <div className="absolute inset-0 -z-10" />

        <Container className="relative z-10 w-full py-0">
          <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(28,29,82,0.16)] md:min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16">
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8">
                  <img src="/logo.png" alt="Grouh Academy logo" className="mb-3 h-10 w-auto" />
                  <h1 className="text-3xl font-bold tracking-tight text-[#1c1d52] sm:text-4xl">Create account</h1>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Join Grouh Academy and start building the skills that move you forward.</p>
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

                <div className="my-8 flex items-center gap-4 text-xs text-slate-400">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span>or continue with</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15"
                      required
                    />
                  </div>
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
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15"
                      required
                    />
                  </div>

                  <label className="flex items-start gap-3 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#5fbb46] focus:ring-[#5fbb46]"
                    />
                    <span>I agree to the terms and privacy policy.</span>
                  </label>

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {success ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {success}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1c1d52]/20 transition hover:bg-[#292a68] focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </button>
                </form>


                <p className="mt-8 text-center text-sm text-slate-500">
                  Already have an account? <Link href="/login" className="font-semibold text-[#4d9d39] hover:underline">Log in</Link>
                </p>
              </div>
            </div>

            {/* Glassmorphism Card */}
            <div className="hidden md:block flex items-center relative bg-cover bg-center" style={{ backgroundImage: "url('/right-bg.png')" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20" />

              <div className="absolute left-16 top-60 w-[480px] h-[420px] rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-8 flex items-start">
                <div className="max-w-sm">
                  <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#f0be43]">Learn with purpose</p>
                  <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-white">Your next chapter starts here.</h2>
                  <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">Access practical courses, supportive mentors, and a community that keeps you moving.</p>
                </div>
                <div className="absolute right-[-40] bottom-0 w-60">
                  <img src="/woman-with-tab.png" alt="Woman with tablet" className="w-full h-auto" />
                </div>
              </div>

              

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

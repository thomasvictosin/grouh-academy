"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage("Check your email for a secure password reset link.");
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
                  <h1 className="text-3xl font-bold tracking-tight text-[#1c1d52] sm:text-4xl">Forgot password?</h1>
                  <p className="mt-3 text-sm leading-6 text-slate-500">Enter your email to receive a one-time password reset code.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
                    <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#5fbb46] focus:bg-white focus:ring-4 focus:ring-[#5fbb46]/15" />
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1c1d52]/20 transition hover:bg-[#292a68] focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20">Send code</button>
                  {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
                  {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                  Remembered your password? <Link href="/login" className="font-semibold text-[#4d9d39] hover:underline">Back to login</Link>
                </p>
              </div>
            </div>

            <div className="hidden md:block relative bg-cover bg-center" style={{ backgroundImage: "url('/right-bg.png')" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20" />

              <div className="absolute left-16 top-16 w-[420px] h-[420px] rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-8 flex items-start">
                <div className="max-w-sm">
                  <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#f0be43]">Learn with purpose</p>
                  <h2 className="text-4xl font-bold leading-tight lg:text-5xl text-white">Your next chapter starts here.</h2>
                  <p className="mt-5 max-w-xs text-sm leading-6 text-white/75">Access practical courses, supportive mentors, and a community that keeps you moving.</p>
                </div>
              </div>

              <div className="absolute right-8 bottom-0 w-80">
                <img src="/woman-with-tab.png" alt="Woman with tablet" className="w-full h-auto" />
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

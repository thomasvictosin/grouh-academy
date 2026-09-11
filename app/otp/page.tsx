"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setWorking(true);
    const { error: verifyError } = await createSupabaseBrowserClient().auth.verifyOtp({ email, token, type: "signup" });
    if (verifyError) setError(verifyError.message);
    else setMessage("Email verified. You can now sign in.");
    setWorking(false);
  }

  async function resend() {
    setError(null);
    setMessage(null);
    const { error: resendError } = await createSupabaseBrowserClient().auth.resend({ type: "signup", email });
    if (resendError) setError(resendError.message);
    else setMessage("A new verification code has been sent.");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-[#17251c]">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden py-10 sm:py-16">
        <div className="absolute inset-0 -z-10" />








          <Container className="w-full py-0">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl">
              <img src="/logo.png" alt="Grouh Academy logo" className="mb-6 h-10 w-auto" />
              <h1 className="text-3xl font-bold text-[#1c1d52]">Verify your email</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">Enter the six-digit code sent to your email address.</p>
              <form onSubmit={verify} className="mt-6 space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Email address
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#5fbb46]" />
                </label>
                <label className="block text-sm font-semibold text-slate-700">Verification code
                  <input required minLength={6} maxLength={6} inputMode="numeric" value={token} onChange={(event) => setToken(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center tracking-[0.35em] outline-none focus:border-[#5fbb46]" />
                </label>
                {message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
                {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <button disabled={working} className="w-full rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60">{working ? 'Verifying...' : 'Verify email'}</button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-500">Didn&apos;t get the code? <button type="button" onClick={() => void resend()} className="font-semibold text-[#4d9d39]">Resend</button></p>
              <Link href="/login" className="mt-4 block text-center text-sm font-semibold text-[#4d9d39]">Back to login</Link>
            </div>
          </Container>
      </section>
    </main>
  );
}

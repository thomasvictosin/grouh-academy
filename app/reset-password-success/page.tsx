import React from "react";
import Container from "@/components/Container";

export default function ResetPasswordSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-[#17251c]">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden py-10 sm:py-16">
        <div className="absolute inset-0 -z-10" />

        <Container className="relative z-10 w-full py-0">
          <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(28,29,82,0.16)] md:min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
            <div className="flex items-center px-6 py-12 sm:px-12 lg:px-16">
              <div className="mx-auto w-full max-w-md text-center">
                <div className="mb-8 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5fbb46]/15 text-[#5fbb46]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
                      <path fill="currentColor" d="M9.55 16.1 5.8 12.36l1.42-1.42 2.33 2.32 7.23-7.23 1.42 1.42-8.65 8.65Z" />
                    </svg>
                  </div>
                </div>

                <img src="/logo.png" alt="Grouh Academy logo" className="mx-auto mb-4 h-10 w-auto" />
                <h1 className="text-3xl font-bold tracking-tight text-[#1c1d52] sm:text-4xl">Password changed</h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">Your password has been updated successfully. You can now continue to your account.</p>

                <div className="mt-8">
                  <a href="/login" className="inline-flex w-full items-center justify-center rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1c1d52]/20 transition hover:bg-[#292a68] focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20">
                    Back to login
                  </a>
                </div>
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

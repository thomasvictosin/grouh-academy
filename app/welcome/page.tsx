import React from "react";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
      <div className="w-full max-w-6xl md:h-[680px] h-auto rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Left (white) */}
        <div className="flex flex-col items-center justify-center bg-white px-8 md:px-20 py-12">
          <div className="w-full max-w-sm flex flex-col gap-10 items-center justify-start">
            <img src="/logo.png" alt="Grouh Academy logo" className="mb-4 h-10 w-auto" />
            <div className="flex flex-col items-center justify-start">
             <button className="w-full md:w-64 rounded-xl bg-[#1c1d52] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#1c1d52]/20 transition hover:bg-[#292a68] focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20 mb-6">Login</button>
             <button className="w-full md:w-64 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1c1d52] border border-[#1c1d52] transition hover:bg-[#292a68] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#1c1d52]/20 mb-6">Register</button>
             <a href="#" className="text-sm text-amber-500 hover:underline">Continue as a guest</a>
            </div>
          </div>
        </div>

        {/* Right (background image) */}
        <div className="hidden md:block relative bg-cover bg-center" style={{ backgroundImage: "url('/right-bg.png')" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20"></div>

          {/* Glassmorphism Card */}
          <div className="absolute left-16 top-16 w-[420px] h-[420px] rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 p-8 flex items-start">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Very good
              <br />
              works are
              <br />
              waiting for
              <br />
              you Login
              <br />
              Now!!!
            </h1>
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
    </div>
  );
}

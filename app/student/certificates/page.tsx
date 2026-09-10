const certificates = [
  { id: '2026-00847', title: 'Full Stack Development', date: 'August 30, 2026' },
  { id: '2026-00431', title: 'Introduction to UI/UX Design', date: 'June 12, 2026' },
  { id: '2026-00120', title: 'Laravel Backend Essentials', date: 'April 18, 2026' },
]

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-7">
        <h1 className="text-3xl font-bold tracking-tight">Certificate System</h1>
        <p className="mt-2 max-w-3xl text-sm leading-5 text-[#14204f]/75">Your official credentials are automatically compiled and issued as downloadable PDFs once course graduation prerequisites are evaluated.</p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-[#1C1D52]">Currently Selected Certificate</h2>
        <div className="rounded-2xl bg-[#1C1D52] p-1 shadow-[0_10px_24px_rgba(28,29,82,0.16)]">
          <div className="rounded-xl border-2 border-[#f3b619] bg-white px-5 py-5 text-[#1C1D52] sm:px-8 sm:py-7">
            <div className="flex items-center justify-between text-xs font-bold"><span className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1C1D52]" />TechBridge Academy</span><span className="text-[9px] uppercase tracking-widest text-[#5FBB46]">Official certification</span></div>
            <div className="mx-auto max-w-xl text-center">
              <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.3em]">Certificate of Completion</p>
              <p className="mt-4 text-[10px] text-slate-500">This is proudly presented to</p>
              <h3 className="mt-2 inline-block border-b border-[#f3b619] px-3 pb-2 text-2xl font-medium sm:text-3xl">Emmanuel Aster</h3>
              <p className="mx-auto mt-3 max-w-md text-[10px] leading-4 text-slate-500">for successfully completing the advanced industry certification curriculum and demonstrating mastery in professional industry standards for</p>
              <p className="mt-4 text-sm font-bold text-[#5FBB46]">Full Stack Development</p>
              <p className="mt-3 text-[10px] text-slate-500">Completed on August 30, 2026</p>
            </div>
            <div className="mt-7 flex items-end justify-between text-[9px] text-slate-500"><div><p className="font-serif text-sm text-[#1C1D52]">Dr. Marcus Vance</p><div className="mt-1 border-t border-slate-300 pt-1 uppercase tracking-wider">Academy Director</div></div><div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#f3b619] bg-[#ffc32b] text-xs text-white shadow-inner">★</div><div className="text-right">Certificate No: <strong>CRT-2026-00847</strong><br />Verification ID: <strong>VR-7X9K2M44</strong></div></div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#1C1D52]">Your Earned Credentials</h2><a href="#security" className="text-[10px] font-bold text-blue-600 hover:underline">See Security FAQ</a></div>
        <div className="mt-4 space-y-2">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="flex flex-col gap-3 rounded-xl bg-[#fbfcff] p-3 shadow-[0_3px_12px_rgba(28,29,82,0.05)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">▱</span><div><h3 className="text-xs font-bold text-[#1C1D52]">{certificate.title}</h3><p className="mt-1 text-[9px] text-slate-500">Completed on {certificate.date} · ID: CERT-{certificate.id}</p></div></div>
              <div className="flex gap-2 sm:shrink-0"><button type="button" className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#1C1D52]">View Online</button><button type="button" className="rounded-lg bg-[#1C1D52] px-3 py-2 text-[10px] font-semibold text-white">Download PDF</button></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

'use client'

import { ArrowLeft, Award, CheckCircle2, Download, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const templates = [
  {
    id: 'signature-modern',
    name: 'Modern Signature',
    badge: 'Signature',
    description: 'A clean, professional certificate for today’s learning programs with a strong academic feel.',
    header: 'Certificate of Completion',
    accent: 'bg-[#5FBB46]',
    accentSoft: 'bg-[#ecf9e7]',
    accentText: 'text-[#5FBB46]',
    frame: 'bg-[radial-gradient(circle_at_top,_#f5fbf2,_#ffffff_55%)]',
    panel: 'bg-[#f8fbff]',
    layoutLabel: 'Signature modern layout',
  },
  {
    id: 'heritage-classic',
    name: 'Heritage Classic',
    badge: 'Classic',
    description: 'A timeless, formal layout designed for premium courses and formal recognition ceremonies.',
    header: 'Official Course Completion',
    accent: 'bg-[#1C1D52]',
    accentSoft: 'bg-[#edf0ff]',
    accentText: 'text-[#1C1D52]',
    frame: 'bg-[radial-gradient(circle_at_top,_#f2f4ff,_#ffffff_55%)]',
    panel: 'bg-[#fafaff]',
    layoutLabel: 'Classic heritage layout',
  },
  {
    id: 'summit-creative',
    name: 'Summit Creative',
    badge: 'Creative',
    description: 'A vibrant, high-energy design for innovative tracks that need a more contemporary edge.',
    header: 'Certificate of Achievement',
    accent: 'bg-[#7C3AED]',
    accentSoft: 'bg-[#f2ebff]',
    accentText: 'text-[#7C3AED]',
    frame: 'bg-[radial-gradient(circle_at_top,_#f5f0ff,_#ffffff_55%)]',
    panel: 'bg-[#faf8ff]',
    layoutLabel: 'Creative summit layout',
  },
  {
    id: 'zen-minimal',
    name: 'Zen Minimal',
    badge: 'Minimal',
    description: 'A refined and minimal certificate template with plenty of breathing room for premium branding.',
    header: 'Completion Certificate',
    accent: 'bg-[#0F766E]',
    accentSoft: 'bg-[#e6fffb]',
    accentText: 'text-[#0F766E]',
    frame: 'bg-[radial-gradient(circle_at_top,_#f0fdfd,_#ffffff_55%)]',
    panel: 'bg-[#f8fffe]',
    layoutLabel: 'Zen minimal layout',
  },
] as const

export default function CertificateTemplatesPage() {
  const searchParams = useSearchParams()
  const selectedTemplateId = searchParams.get('template') ?? templates[0].id
  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId) ?? templates[0]

  const handleDownloadSample = () => {
    const html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${selectedTemplate.name} Certificate Sample</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #f4f8f2; color: #1C1D52; }
            .sheet { max-width: 980px; margin: 48px auto; background: white; border-radius: 32px; box-shadow: 0 20px 40px rgba(28,29,82,0.12); padding: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #e5e7eb; }
            .brand { display: flex; align-items: center; gap: 16px; }
            .brand-mark { width: 62px; height: 62px; border-radius: 20px; display: flex; align-items: center; justify-content: center; background: ${selectedTemplate.accent.replace('bg-', '#')}; color: white; font-size: 24px; }
            .eyebrow { margin: 0; font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #64748b; }
            .title { margin: 8px 0 0; font-size: 36px; font-weight: 700; }
            .meta { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; margin-top: 36px; }
            .student { font-size: 30px; font-weight: 600; margin: 12px 0; }
            .body { font-size: 16px; line-height: 1.7; color: #475569; }
            .panel { background: #f8fbff; border-radius: 20px; padding: 18px; border: 1px solid #edf2f7; }
            .list { margin: 14px 0 0; display: grid; gap: 10px; font-size: 12px; color: #64748b; }
            .list-item { background: white; border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; }
            .footer { margin-top: 26px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 12px; }
            .pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; background: #e8faf7; color: #047857; font-weight: 700; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <div class="brand">
                <div class="brand-mark">A</div>
                <div>
                  <p class="eyebrow">Grouh Academy</p>
                  <h1 class="title">${selectedTemplate.header}</h1>
                </div>
              </div>
              <div class="pill">Verified</div>
            </div>

            <div class="meta">
              <div>
                <p style="margin: 0; font-size: 14px; color: #64748b;">This certifies that</p>
                <p class="student">Emma Thompson</p>
                <div style="height:1px; background:#e5e7eb; margin-top:18px;"></div>
                <p class="body">Has successfully completed the ${selectedTemplate.name} learning journey and demonstrated the required knowledge, effort, and professionalism throughout the program.</p>
              </div>

              <div class="panel">
                <div class="list">
                  <div class="list-item"><span>Template</span><strong>${selectedTemplate.name}</strong></div>
                  <div class="list-item"><span>Issue date</span><strong>2025-02-05</strong></div>
                  <div class="list-item"><span>Verification code</span><strong>WDB-9204A</strong></div>
                </div>
              </div>
            </div>

            <div class="footer">
              <span>Layout: ${selectedTemplate.layoutLabel}</span>
              <span>Ready for approval</span>
            </div>
          </div>
        </body>
      </html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${selectedTemplate.id}-sample.html`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[1200px] space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Certificate management</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52]">Certificate Templates</h1>
        </div>

        <Link
          href="/admin/student/certificates"
          className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-4 py-2.5 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to certificates
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-3 rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/admin/student/certificates/templates?template=${template.id}`}
              className={`block rounded-2xl border p-4 transition ${selectedTemplate.id === template.id ? 'border-[#5FBB46] bg-[#f3fbe8]' : 'border-slate-200 bg-[#f8fbff] hover:border-slate-300'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-bold text-white ${template.accent}`}>
                  {template.badge}
                </span>
                <span className="text-[9px] font-semibold text-slate-500">Design</span>
              </div>

              <h2 className="mt-3 text-sm font-bold text-[#1C1D52]">{template.name}</h2>
              <p className="mt-2 text-[10px] leading-5 text-slate-500">{template.description}</p>
            </Link>
          ))}
        </aside>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Preview</p>
              <h2 className="mt-1 text-xl font-semibold text-[#1C1D52]">{selectedTemplate.name}</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/student/certificates/cert-902/edit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Customize
              </Link>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f] hover:bg-[#4aaa3e]"
              >
                <Download className="h-3.5 w-3.5" />
                Download sample
              </button>
            </div>
          </div>

          <div className={`mt-6 rounded-[28px] border border-slate-200 p-6 ${selectedTemplate.frame}`}>
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
                  <img src="/logo.png" alt="Grouh Academy logo" className="h-8 w-auto" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Grouh Academy</p>
                  <h3 className="mt-2 text-3xl font-bold text-[#1C1D52]">{selectedTemplate.header}</h3>
                </div>
              </div>

              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${selectedTemplate.accent}`}>
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm text-slate-500">This certifies that</p>
                <p className="mt-3 text-2xl font-semibold text-[#1C1D52]">Emma Thompson</p>
                <div className="mt-4 h-px w-full bg-slate-200" />

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Has successfully completed the {selectedTemplate.name} learning journey and demonstrated the required knowledge,
                  effort, and professionalism throughout the program.
                </p>
              </div>

              <div className={`rounded-2xl p-4 shadow-[inset_0_0_0_1px_#edf2f7] ${selectedTemplate.panel}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Status</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-bold ${selectedTemplate.accentSoft} ${selectedTemplate.accentText}`}>
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-[10px] text-slate-500">
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                    <span>Template</span>
                    <span className="font-semibold text-[#1C1D52]">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                    <span>Issue date</span>
                    <span className="font-semibold text-[#1C1D52]">2025-02-05</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                    <span>Verification code</span>
                    <span className="font-semibold text-[#1C1D52]">WDB-9204A</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Layout: {selectedTemplate.layoutLabel}
              </div>
              <div className={`flex items-center gap-2 text-[10px] ${selectedTemplate.accentText}`}>
                <CheckCircle2 className={`h-3.5 w-3.5 ${selectedTemplate.accentText}`} />
                Ready for approval
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

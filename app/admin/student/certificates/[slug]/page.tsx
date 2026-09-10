'use client'

import { ArrowLeft, Award, CheckCircle2, Download, FileText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const certificateDetailData: Record<string, {
  id: string
  student: string
  course: string
  instructor: string
  issued: string
  expiry: string
  status: 'Issued' | 'Pending' | 'Revoked'
  code: string
  description: string
}> = {
  'cert-902': {
    id: '#CERT-902',
    student: 'Emma Thompson',
    course: 'Web Development',
    instructor: 'Sarah Johnson',
    issued: '2025-02-05',
    expiry: 'No Expiry',
    status: 'Issued',
    code: 'WDB-9204A',
    description: 'Awarded for successful completion of the Web Development track, including practical assignments and project implementation.',
  },
  'cert-901': {
    id: '#CERT-901',
    student: 'James Wilson',
    course: 'Data Science Fundamentals',
    instructor: 'David Miller',
    issued: '2025-02-01',
    expiry: '2027-02-01',
    status: 'Issued',
    code: 'DSF-1849D',
    description: 'Awarded for demonstrating strong understanding in data analysis, statistics, visualization, and introductory machine learning methods.',
  },
  'cert-900': {
    id: '#CERT-900',
    student: 'Noah Kim',
    course: 'Machine Learning',
    instructor: 'David Miller',
    issued: '2025-01-28',
    expiry: 'No Expiry',
    status: 'Issued',
    code: 'MLM-3958K',
    description: 'Recognizes successful completion of the Machine Learning stream, including model building, validation, and evaluation tasks.',
  },
  'cert-899': {
    id: '#CERT-899',
    student: 'Liam Chen',
    course: 'UI/UX Design Mastery',
    instructor: 'Jessie Cooper',
    issued: '2025-01-20',
    expiry: 'No Expiry',
    status: 'Pending',
    code: 'UID-8495L',
    description: 'Pending final administrative approval following the student’s design capstone review.',
  },
  'cert-898': {
    id: '#CERT-898',
    student: 'Ava Martinez',
    course: 'iOS App Development',
    instructor: 'Jessie Cooper',
    issued: '2025-01-15',
    expiry: 'No Expiry',
    status: 'Revoked',
    code: 'IOS-2849M',
    description: 'This certificate was revoked after a verification review flagged incomplete assessment requirements.',
  },
  'cert-897': {
    id: '#CERT-897',
    student: 'Olivia Patel',
    course: 'Digital Marketing',
    instructor: 'Alex Rivers',
    issued: '2025-01-10',
    expiry: 'No Expiry',
    status: 'Issued',
    code: 'DMB-4859P',
    description: 'Awarded for completing the Digital Marketing pathway covering strategy, content production, and campaign management.',
  },
  'cert-896': {
    id: '#CERT-896',
    student: 'Siddharth Sen',
    course: 'Python Programming',
    instructor: 'Sarah Johnson',
    issued: '2025-01-08',
    expiry: 'No Expiry',
    status: 'Issued',
    code: 'PYT-9204S',
    description: 'Issued after the learner completed coding exercises, assessments, and a final Python project review.',
  },
  'cert-895': {
    id: '#CERT-895',
    student: 'Alice Springs',
    course: 'Advanced React',
    instructor: 'Sarah Johnson',
    issued: '2025-01-05',
    expiry: '2026-01-05',
    status: 'Issued',
    code: 'ARP-1049A',
    description: 'Awarded for mastery in advanced React patterns, state management, and component architecture.',
  },
}

const statusStyles = {
  Issued: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Revoked: 'bg-red-100 text-red-500',
}

export default function CertificateDetailPage() {
  const params = useParams<{ slug: string }>()
  const certificate = certificateDetailData[params.slug] ?? certificateDetailData['cert-902']

  const handleDownload = () => {
    const html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Certificate ${certificate.id}</title>
          <style>
            body { margin: 0; font-family: Arial, sans-serif; background: #eef7eb; color: #1C1D52; }
            .sheet { max-width: 980px; margin: 48px auto; background: white; border-radius: 32px; box-shadow: 0 20px 40px rgba(28,29,82,0.12); padding: 40px; }
            .top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; padding-bottom: 24px; }
            .brand { display: flex; align-items: center; gap: 16px; }
            .logo { width: 62px; height: 62px; border-radius: 18px; background: #5FBB46; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; }
            .eyebrow { margin: 0; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; color: #64748b; }
            .title { margin: 8px 0 0; font-size: 36px; font-weight: 700; }
            .pill { background: #e8faf7; color: #047857; border-radius: 999px; padding: 8px 12px; font-size: 10px; font-weight: 700; }
            .body { margin-top: 32px; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; }
            .student { margin: 14px 0; font-size: 30px; font-weight: 600; }
            .description { color: #475569; font-size: 16px; line-height: 1.7; }
            .panel { background: #f8fbff; border-radius: 20px; padding: 20px; border: 1px solid #edf2f7; }
            .rows { display: grid; gap: 10px; margin-top: 14px; }
            .row { background: white; border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
            .row strong { color: #1C1D52; }
            .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 16px; display: flex; justify-content: space-between; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="top">
              <div class="brand">
                <div class="logo">G</div>
                <div>
                  <p class="eyebrow">Grouh Academy</p>
                  <h1 class="title">Certificate of Completion</h1>
                </div>
              </div>
              <div class="pill">Verified</div>
            </div>

            <div class="body">
              <div>
                <p style="margin:0; color:#64748b; font-size:14px;">This certifies that</p>
                <p class="student">${certificate.student}</p>
                <div style="height:1px; background:#e5e7eb; margin-top:18px;"></div>
                <p class="description">${certificate.description}</p>
              </div>

              <div class="panel">
                <div class="rows">
                  <div class="row"><span>Student</span><strong>${certificate.student}</strong></div>
                  <div class="row"><span>Course</span><strong>${certificate.course}</strong></div>
                  <div class="row"><span>Instructor</span><strong>${certificate.instructor}</strong></div>
                  <div class="row"><span>Issue date</span><strong>${certificate.issued}</strong></div>
                  <div class="row"><span>Verification code</span><strong>${certificate.code}</strong></div>
                </div>
              </div>
            </div>

            <div class="footer">
              <span>Course: ${certificate.course}</span>
              <span>Verification code: ${certificate.code}</span>
            </div>
          </div>
        </body>
      </html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${certificate.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-certificate.html`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/student/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to certificates
      </Link>

      <section className="rounded-2xl bg-white p-6 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecf9e7] shadow-[inset_0_0_0_1px_rgba(95,187,70,0.18)]">
              <img src="/logo.png" alt="Grouh Academy logo" className="h-8 w-auto" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Certificate</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{certificate.id}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[certificate.status]}`}>
              {certificate.status}
            </span>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,_#f5fbf2,_#ffffff_55%)] p-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]">
                  <img src="/logo.png" alt="Grouh Academy logo" className="h-8 w-auto" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Grouh Academy</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#1C1D52]">Certificate of Completion</h2>
                </div>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5FBB46]">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-500">This certifies that</p>
              <p className="mt-3 text-2xl font-semibold text-[#1C1D52]">{certificate.student}</p>
              <div className="mt-4 h-px w-full bg-slate-200" />
              <p className="mt-4 text-sm leading-6 text-slate-600">{certificate.description}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <FileText className="h-3.5 w-3.5" />
                Course: {certificate.course}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5FBB46]" />
                Verification code: {certificate.code}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-[#f8fbff] p-4 shadow-[inset_0_0_0_1px_#edf2f7]">
              <h3 className="text-sm font-bold text-[#1C1D52]">Certificate Details</h3>
              <dl className="mt-4 space-y-3 text-[10px] text-slate-500">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                  <dt>Student</dt>
                  <dd className="font-semibold text-[#1C1D52]">{certificate.student}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                  <dt>Course</dt>
                  <dd className="font-semibold text-[#1C1D52]">{certificate.course}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                  <dt>Instructor</dt>
                  <dd className="font-semibold text-[#1C1D52]">{certificate.instructor}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                  <dt>Issue date</dt>
                  <dd className="font-semibold text-[#1C1D52]">{certificate.issued}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white p-3">
                  <dt>Expiry</dt>
                  <dd className="font-semibold text-[#1C1D52]">{certificate.expiry}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1C1D52]">
                <CheckCircle2 className="h-4 w-4 text-[#5FBB46]" />
                Verification status
              </div>
              <p className="mt-3 text-[10px] leading-5 text-slate-500">
                This certificate has been verified and is ready for sharing or download.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}

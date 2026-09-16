'use client'

import { Download, Award, Lock } from 'lucide-react'
import { useEffect, useState } from 'react'
import InternshipShell from '@/components/InternshipShell'

type CertificateData = {
  eligible: boolean
  reason?: string
  progressPercent?: number
  studentName?: string
  programName?: string
  certificateNumber?: string
  issuedDateLabel?: string
}

export default function InternshipCertificatePage() {
  const [data, setData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/internship/certificate')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load certificate.')
        return response.json() as Promise<CertificateData>
      })
      .then(setData)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load certificate.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <InternshipShell><p className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.09)]">Loading certificate...</p></InternshipShell>
  }

  if (error) {
    return <InternshipShell><div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div></InternshipShell>
  }

  if (!data?.eligible) {
    return (
      <InternshipShell>
        <div className="rounded-2xl bg-white p-10 text-center shadow-[0_8px_24px_rgba(28,29,82,0.09)]">
          <Lock className="mx-auto h-10 w-10 text-slate-300" />
          <h1 className="mt-4 text-lg font-bold text-[#1C1D52]">Certificate not yet available</h1>
          <p className="mt-2 text-sm text-slate-500">{data?.reason ?? 'Complete your internship to unlock this certificate.'}</p>
          {typeof data?.progressPercent === 'number' && (
            <div className="mx-auto mt-6 max-w-xs">
              <div className="h-2 rounded-full bg-[#E7EEF8]"><div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${data.progressPercent}%` }} /></div>
              <p className="mt-2 text-xs font-semibold text-[#5FBB46]">{data.progressPercent}% complete</p>
            </div>
          )}
        </div>
      </InternshipShell>
    )
  }

  return (
    <InternshipShell>
      <div className="space-y-5">
        <div className="rounded-2xl border-4 border-[#5FBB46] bg-white p-10 text-center shadow-[0_12px_40px_rgba(28,29,82,0.12)] sm:p-14">
          <Award className="mx-auto h-12 w-12 text-[#5FBB46]" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#1C1D52]">Certificate of Completion</p>
          <p className="mt-6 text-sm text-slate-500">This certifies that</p>
          <h1 className="mt-2 text-3xl font-black text-[#5FBB46] sm:text-4xl">{data.studentName}</h1>
          <p className="mt-4 text-sm text-slate-500">has successfully completed the internship program</p>
          <h2 className="mt-2 text-xl font-bold text-[#1C1D52] sm:text-2xl">{data.programName}</h2>
          <div className="mx-auto mt-10 flex max-w-md flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-400 sm:flex-row sm:justify-between">
            <span>Certificate No. {data.certificateNumber}</span>
            <span>Issued {data.issuedDateLabel}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <a
            href="/api/internship/certificate/pdf"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#4aaa3e]"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </div>
    </InternshipShell>
  )
}
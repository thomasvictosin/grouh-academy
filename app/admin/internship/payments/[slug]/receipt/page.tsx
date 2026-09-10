'use client'

import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function InternshipPaymentReceiptPage() {
  const params = useParams<{ slug: string }>()

  return (
    <div className="mx-auto max-w-[900px] space-y-5 p-6">
      <Link href="/admin/internship/payments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Receipt</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{params.slug}</h1>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]">
            <Download className="h-3.5 w-3.5" />
            Download receipt
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <InfoRow label="Invoice" value="INV-2049" />
          <InfoRow label="Student" value="Ada Nwosu" />
          <InfoRow label="Track" value="Software Development" />
          <InfoRow label="Amount" value="$249" />
        </div>
      </section>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-4">
      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-[#1C1D52]">{value}</span>
    </div>
  )
}

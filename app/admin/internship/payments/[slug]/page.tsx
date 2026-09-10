'use client'

import { ArrowLeft, CalendarDays, CreditCard, Download, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const paymentDetailData: Record<string, any> = {
  'pay-410': { id: 'PAY-410', student: 'Ada Nwosu', track: 'Software Development', amount: '$249', status: 'Paid', date: '2026-09-08', invoice: 'INV-2049' },
  'pay-409': { id: 'PAY-409', student: 'Chinedu Adebayo', track: 'Product Design', amount: '$199', status: 'Pending', date: '2026-09-07', invoice: 'INV-2048' },
  'pay-408': { id: 'PAY-408', student: 'Tobi Akin', track: 'Data Analytics', amount: '$249', status: 'Refund review', date: '2026-09-06', invoice: 'INV-2047' },
}

export default function InternshipPaymentDetailPage() {
  const params = useParams<{ slug: string }>()
  const payment = paymentDetailData[params.slug] ?? paymentDetailData['pay-410']

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/internship/payments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <section className="rounded-[28px] bg-white p-6 shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Payment detail</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{payment.id}</h1>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]">
            <Download className="h-3.5 w-3.5" />
            Download receipt
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] bg-[#f8fbff] p-5">
            <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Student</p>
            <p className="mt-4 text-2xl font-bold text-[#1C1D52]">{payment.student}</p>
            <div className="mt-5 space-y-3">
              <Row label="Track" value={payment.track} />
              <Row label="Amount" value={payment.amount} />
              <Row label="Method" value="Card" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <p className="flex justify-between gap-4"><span className="text-slate-500">Invoice</span><span className="font-semibold text-[#1C1D52]">{payment.invoice}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Payment date</span><span className="font-semibold text-[#1C1D52]">{payment.date}</span></p>
                <p className="flex justify-between gap-4"><span className="text-slate-500">Status</span><span className="font-semibold text-[#1C1D52]">{payment.status}</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-3.5">
      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-[#1C1D52]">{value}</span>
    </div>
  )
}

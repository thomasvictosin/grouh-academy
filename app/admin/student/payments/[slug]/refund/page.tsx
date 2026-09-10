'use client'

import { ArrowLeft, AlertTriangle, CheckCircle2, CreditCard, Download } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const refundData: Record<string, {
  id: string
  student: string
  course: string
  amount: string
  method: string
  status: string
  date: string
}> = {
  'txn-089': {
    id: '#TXN-089',
    student: 'Emma Thompson',
    course: 'Web Development',
    amount: '$299',
    method: 'Credit Card',
    status: 'Eligible for refund',
    date: '2025-02-15',
  },
  'txn-088': {
    id: '#TXN-088',
    student: 'James Wilson',
    course: 'Data Science Fundamentals',
    amount: '$199',
    method: 'PayPal',
    status: 'Eligible for refund',
    date: '2025-02-14',
  },
  'txn-087': {
    id: '#TXN-087',
    student: 'Sofia Rodriguez',
    course: 'UI/UX Design Mastery',
    amount: '$299',
    method: 'Credit Card',
    status: 'Review required',
    date: '2025-02-14',
  },
  'txn-086': {
    id: '#TXN-086',
    student: 'Liam Chen',
    course: 'Python Programming',
    amount: '$199',
    method: 'Credit Card',
    status: 'Eligible for refund',
    date: '2025-02-13',
  },
  'txn-085': {
    id: '#TXN-085',
    student: 'Olivia Patel',
    course: 'Digital Marketing',
    amount: '$99',
    method: 'Bank Transfer',
    status: 'Refund processed',
    date: '2025-02-12',
  },
  'txn-084': {
    id: '#TXN-084',
    student: 'Noah Kim',
    course: 'Machine Learning',
    amount: '$399',
    method: 'PayPal',
    status: 'Eligible for refund',
    date: '2025-02-10',
  },
  'txn-083': {
    id: '#TXN-083',
    student: 'Ava Martinez',
    course: 'iOS App Development',
    amount: '$299',
    method: 'Credit Card',
    status: 'Failed payment',
    date: '2025-02-09',
  },
  'txn-082': {
    id: '#TXN-082',
    student: 'Ethan Brooks',
    course: 'Advanced React',
    amount: '$199',
    method: 'Bank Transfer',
    status: 'Eligible for refund',
    date: '2025-02-08',
  },
}

export default function TransactionRefundPage() {
  const params = useParams<{ slug: string }>()
  const refund = refundData[params.slug] ?? refundData['txn-089']

  const handleExportRefund = () => {
    const rows = [
      ['Transaction ID', refund.id],
      ['Student', refund.student],
      ['Course', refund.course],
      ['Amount', refund.amount],
      ['Method', refund.method],
      ['Status', refund.status],
      ['Date', refund.date],
    ]

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${refund.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-refund.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-5 p-6">
      <Link href="/admin/student/payments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <section className="rounded-2xl bg-white p-6 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5FBB46]">Refund request</p>
            <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{refund.id}</h1>
          </div>

          <button
            type="button"
            onClick={handleExportRefund}
            className="inline-flex items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]"
          >
            <Download className="h-3.5 w-3.5" />
            Export summary
          </button>
        </div>

        <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-3 rounded-xl bg-white p-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-[#fff0d8] text-orange-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Status</p>
              <p className="mt-1 text-lg font-semibold text-[#1C1D52]">{refund.status}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Student</span>
              <span className="text-sm font-semibold text-[#1C1D52]">{refund.student}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Course</span>
              <span className="text-sm font-semibold text-[#1C1D52]">{refund.course}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Refund amount</span>
              <span className="text-sm font-semibold text-[#1C1D52]">{refund.amount}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Original method</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1D52]"><CreditCard className="h-4 w-4" />{refund.method}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white p-4">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Date</span>
              <span className="text-sm font-semibold text-[#1C1D52]">{refund.date}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#e8faf7] p-3 text-[10px] font-semibold text-teal-700">
            <CheckCircle2 className="h-4 w-4" />
            Review and refund actions are available from the student admin workflow.
          </div>
        </div>
      </section>
    </div>
  )
}

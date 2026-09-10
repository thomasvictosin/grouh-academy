'use client'

import { ArrowLeft, CalendarDays, CheckCircle2, CreditCard, Download, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const transactionDetailData: Record<string, {
  id: string
  student: string
  course: string
  amount: string
  method: string
  status: 'Completed' | 'Pending' | 'Refunded' | 'Failed'
  date: string
  invoice: string
}> = {
  'txn-089': {
    id: '#TXN-089',
    student: 'Emma Thompson',
    course: 'Web Development',
    amount: '$299',
    method: 'Credit Card',
    status: 'Completed',
    date: '2025-02-15',
    invoice: 'INV-2049',
  },
  'txn-088': {
    id: '#TXN-088',
    student: 'James Wilson',
    course: 'Data Science Fundamentals',
    amount: '$199',
    method: 'PayPal',
    status: 'Completed',
    date: '2025-02-14',
    invoice: 'INV-2048',
  },
  'txn-087': {
    id: '#TXN-087',
    student: 'Sofia Rodriguez',
    course: 'UI/UX Design Mastery',
    amount: '$299',
    method: 'Credit Card',
    status: 'Pending',
    date: '2025-02-14',
    invoice: 'INV-2047',
  },
  'txn-086': {
    id: '#TXN-086',
    student: 'Liam Chen',
    course: 'Python Programming',
    amount: '$199',
    method: 'Credit Card',
    status: 'Completed',
    date: '2025-02-13',
    invoice: 'INV-2046',
  },
  'txn-085': {
    id: '#TXN-085',
    student: 'Olivia Patel',
    course: 'Digital Marketing',
    amount: '$99',
    method: 'Bank Transfer',
    status: 'Refunded',
    date: '2025-02-12',
    invoice: 'INV-2045',
  },
  'txn-084': {
    id: '#TXN-084',
    student: 'Noah Kim',
    course: 'Machine Learning',
    amount: '$399',
    method: 'PayPal',
    status: 'Completed',
    date: '2025-02-10',
    invoice: 'INV-2044',
  },
  'txn-083': {
    id: '#TXN-083',
    student: 'Ava Martinez',
    course: 'iOS App Development',
    amount: '$299',
    method: 'Credit Card',
    status: 'Failed',
    date: '2025-02-09',
    invoice: 'INV-2043',
  },
  'txn-082': {
    id: '#TXN-082',
    student: 'Ethan Brooks',
    course: 'Advanced React',
    amount: '$199',
    method: 'Bank Transfer',
    status: 'Completed',
    date: '2025-02-08',
    invoice: 'INV-2042',
  },
}

const statusStyles = {
  Completed: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Refunded: 'bg-slate-100 text-slate-500',
  Failed: 'bg-red-100 text-red-500',
}

export default function TransactionDetailPage() {
  const params = useParams<{ slug: string }>()
  const transaction = transactionDetailData[params.slug] ?? transactionDetailData['txn-089']

  const handleExportReceipt = () => {
    const rows = [
      ['Invoice', transaction.invoice],
      ['Transaction ID', transaction.id],
      ['Student', transaction.student],
      ['Course', transaction.course],
      ['Amount', transaction.amount],
      ['Method', transaction.method],
      ['Status', transaction.status],
      ['Date', transaction.date],
    ]

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${transaction.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-receipt.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-5 p-6">
      <Link href="/admin/student/payments" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <section className="overflow-hidden rounded-[28px] bg-white shadow-[0_10px_30px_rgba(28,29,82,0.08)]">
        <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,_#f5fbf2,_#ffffff_58%)] p-6 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecf9e7] shadow-[inset_0_0_0_1px_rgba(95,187,70,0.12)]">
                <img src="/logo.png" alt="Grouh Academy logo" className="h-9 w-auto" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5FBB46]">Transaction detail</p>
                <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{transaction.id}</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusStyles[transaction.status]}`}>
                {transaction.status}
              </span>
              <button
                type="button"
                onClick={handleExportReceipt}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f] transition hover:bg-[#4aaa3e]"
              >
                <Download className="h-3.5 w-3.5" />
                Download receipt
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(28,29,82,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Grouh Academy</p>
                  <h2 className="mt-2 text-xl font-bold text-[#1C1D52]">Payment confirmation</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecf9e7]">
                  <CheckCircle2 className="h-5 w-5 text-[#5FBB46]" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Student</span>
                  <span className="text-sm font-semibold text-[#1C1D52]">{transaction.student}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Course</span>
                  <span className="text-sm font-semibold text-[#1C1D52]">{transaction.course}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Amount</span>
                  <span className="text-sm font-semibold text-[#1C1D52]">{transaction.amount}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Payment method</span>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1D52]"><CreditCard className="h-4 w-4" />{transaction.method}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-[#f3f6fb] p-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Total paid</p>
                <p className="mt-3 text-3xl font-bold text-[#1C1D52]">{transaction.amount}</p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(28,29,82,0.04)]">
                <div className="space-y-4">
                  <div className="rounded-xl bg-[#f3f6fb] p-3.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Invoice</p>
                    <p className="mt-2 text-lg font-bold text-[#1C1D52]">{transaction.invoice}</p>
                  </div>
                  <div className="rounded-xl bg-[#f3f6fb] p-3.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Date</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1C1D52]"><CalendarDays className="h-4 w-4" />{transaction.date}</p>
                  </div>
                  <div className="rounded-xl bg-[#f3f6fb] p-3.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Receipt status</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1C1D52]"><WalletCards className="h-4 w-4 text-[#5FBB46]" />Ready for download</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

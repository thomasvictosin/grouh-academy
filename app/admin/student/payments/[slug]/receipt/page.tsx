'use client'

import { ArrowLeft, CreditCard, Download, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const transactionReceiptData: Record<string, {
  id: string
  student: string
  course: string
  amount: string
  method: string
  date: string
  invoice: string
}> = {
  'txn-089': {
    id: '#TXN-089',
    student: 'Emma Thompson',
    course: 'Web Development',
    amount: '$299',
    method: 'Credit Card',
    date: '2025-02-15',
    invoice: 'INV-2049',
  },
  'txn-088': {
    id: '#TXN-088',
    student: 'James Wilson',
    course: 'Data Science Fundamentals',
    amount: '$199',
    method: 'PayPal',
    date: '2025-02-14',
    invoice: 'INV-2048',
  },
  'txn-087': {
    id: '#TXN-087',
    student: 'Sofia Rodriguez',
    course: 'UI/UX Design Mastery',
    amount: '$299',
    method: 'Credit Card',
    date: '2025-02-14',
    invoice: 'INV-2047',
  },
  'txn-086': {
    id: '#TXN-086',
    student: 'Liam Chen',
    course: 'Python Programming',
    amount: '$199',
    method: 'Credit Card',
    date: '2025-02-13',
    invoice: 'INV-2046',
  },
  'txn-085': {
    id: '#TXN-085',
    student: 'Olivia Patel',
    course: 'Digital Marketing',
    amount: '$99',
    method: 'Bank Transfer',
    date: '2025-02-12',
    invoice: 'INV-2045',
  },
  'txn-084': {
    id: '#TXN-084',
    student: 'Noah Kim',
    course: 'Machine Learning',
    amount: '$399',
    method: 'PayPal',
    date: '2025-02-10',
    invoice: 'INV-2044',
  },
  'txn-083': {
    id: '#TXN-083',
    student: 'Ava Martinez',
    course: 'iOS App Development',
    amount: '$299',
    method: 'Credit Card',
    date: '2025-02-09',
    invoice: 'INV-2043',
  },
  'txn-082': {
    id: '#TXN-082',
    student: 'Ethan Brooks',
    course: 'Advanced React',
    amount: '$199',
    method: 'Bank Transfer',
    date: '2025-02-08',
    invoice: 'INV-2042',
  },
}

export default function TransactionReceiptPage() {
  const params = useParams<{ slug: string }>()
  const transaction = transactionReceiptData[params.slug] ?? transactionReceiptData['txn-089']

  const handleDownload = () => {
    const html = `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Receipt ${transaction.id}</title>
        </head>
        <body style="margin:0; font-family:Arial,sans-serif; background:#f5f8fb; color:#1C1D52; padding:40px;">
          <div style="max-width:760px; margin:0 auto; background:#fff; border-radius:24px; box-shadow:0 20px 40px rgba(28,29,82,0.08); padding:32px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:20px;">
              <div>
                <div style="font-size:10px; font-weight:700; letter-spacing:0.18em; color:#5FBB46; text-transform:uppercase;">Grouh Academy</div>
                <h1 style="margin:8px 0 0; font-size:28px;">Payment Receipt</h1>
              </div>
              <div style="display:flex; align-items:center; justify-content:center; width:52px; height:52px; border-radius:18px; background:#ecf9e7; color:#5FBB46;">
                <WalletCards style="width:24px; height:24px;" />
              </div>
            </div>
            <div style="margin-top:24px; display:grid; gap:14px;">
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Invoice</span>
                <strong>${transaction.invoice}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Transaction</span>
                <strong>${transaction.id}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Student</span>
                <strong>${transaction.student}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Course</span>
                <strong>${transaction.course}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Amount</span>
                <strong>${transaction.amount}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding:12px 14px; background:#f3f6fb; border-radius:12px;">
                <span style="font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:0.12em;">Method</span>
                <strong>${transaction.method}</strong>
              </div>
            </div>
          </div>
        </body>
      </html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${transaction.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-receipt.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-5 p-6">
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
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5FBB46]">Receipt</p>
                <h1 className="mt-1 text-2xl font-semibold text-[#1C1D52]">{transaction.id}</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f] transition hover:bg-[#4aaa3e]"
            >
              <Download className="h-3.5 w-3.5" />
              Download receipt
            </button>
          </div>

          <div className="mt-6 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(28,29,82,0.04)] sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Receipt summary</p>
                <h2 className="mt-2 text-xl font-bold text-[#1C1D52]">Payment received</h2>
              </div>
              <div className="rounded-full bg-[#e8faf7] px-3 py-1 text-[9px] font-semibold text-teal-600">
                Verified & paid
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#f3f6fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Invoice</p>
                <p className="mt-2 text-lg font-bold text-[#1C1D52]">{transaction.invoice}</p>
              </div>
              <div className="rounded-2xl bg-[#f3f6fb] p-4">
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Amount</p>
                <p className="mt-2 text-lg font-bold text-[#1C1D52]">{transaction.amount}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Student</span>
                <span className="text-sm font-semibold text-[#1C1D52]">{transaction.student}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Course</span>
                <span className="text-sm font-semibold text-[#1C1D52]">{transaction.course}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#f8fbff] p-3.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Payment method</span>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1D52]"><CreditCard className="h-4 w-4" />{transaction.method}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

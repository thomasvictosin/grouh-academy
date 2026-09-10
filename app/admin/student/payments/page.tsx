'use client'

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, CreditCard, Download, MoreHorizontal, RefreshCw, Search, TrendingUp, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type TransactionStatus = 'Completed' | 'Pending' | 'Refunded' | 'Failed'
type Transaction = { id: string; student: string; course: string; amount: string; method: string; status: TransactionStatus; date: string }

const transactions: Transaction[] = [
  { id: '#TXN-089', student: 'Emma Thompson', course: 'Web Development', amount: '$299', method: 'Credit Card', status: 'Completed', date: '2025-02-15' },
  { id: '#TXN-088', student: 'James Wilson', course: 'Data Science Fundamentals', amount: '$199', method: 'PayPal', status: 'Completed', date: '2025-02-14' },
  { id: '#TXN-087', student: 'Sofia Rodriguez', course: 'UI/UX Design Mastery', amount: '$299', method: 'Credit Card', status: 'Pending', date: '2025-02-14' },
  { id: '#TXN-086', student: 'Liam Chen', course: 'Python Programming', amount: '$199', method: 'Credit Card', status: 'Completed', date: '2025-02-13' },
  { id: '#TXN-085', student: 'Olivia Patel', course: 'Digital Marketing', amount: '$99', method: 'Bank Transfer', status: 'Refunded', date: '2025-02-12' },
  { id: '#TXN-084', student: 'Noah Kim', course: 'Machine Learning', amount: '$399', method: 'PayPal', status: 'Completed', date: '2025-02-10' },
  { id: '#TXN-083', student: 'Ava Martinez', course: 'iOS App Development', amount: '$299', method: 'Credit Card', status: 'Failed', date: '2025-02-09' },
  { id: '#TXN-082', student: 'Ethan Brooks', course: 'Advanced React', amount: '$199', method: 'Bank Transfer', status: 'Completed', date: '2025-02-08' },
]

const statusStyles: Record<TransactionStatus, string> = {
  Completed: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Refunded: 'bg-slate-100 text-slate-500',
  Failed: 'bg-red-100 text-red-500',
}

const tabs: { label: string; value: 'All' | TransactionStatus; count: number }[] = [
  { label: 'All Transactions', value: 'All', count: 2340 },
  { label: 'Completed', value: 'Completed', count: 2180 },
  { label: 'Pending', value: 'Pending', count: 98 },
  { label: 'Refunded', value: 'Refunded', count: 42 },
  { label: 'Failed', value: 'Failed', count: 20 },
]

function transactionSlug(transactionId: string) {
  return transactionId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'All' | TransactionStatus>('All')
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('This Month')
  const [method, setMethod] = useState('All')
  const [amount, setAmount] = useState('Any')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const visibleTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesTab = activeTab === 'All' || transaction.status === activeTab
    const searchValue = `${transaction.id} ${transaction.student} ${transaction.course}`.toLowerCase()
    return matchesTab && searchValue.includes(query.toLowerCase()) && (method === 'All' || transaction.method === method)
  }), [activeTab, method, query])

  const handleExportCsv = () => {
    const rows = [
      ['Transaction ID', 'Student', 'Course', 'Amount', 'Method', 'Status', 'Date'],
      ...transactions.map((transaction) => [
        transaction.id,
        transaction.student,
        transaction.course,
        transaction.amount,
        transaction.method,
        transaction.status,
        transaction.date,
      ]),
    ]

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'financial-transactions.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Financial Transactions</h1><p className="mt-2 text-xs text-slate-500">Track global revenue flow, pending payouts, refunds and transaction statuses</p></div><button type="button" onClick={handleExportCsv} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]"><Download className="h-3.5 w-3.5" />Export CSV</button></header><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><FinanceStat icon={<TrendingUp className="h-4 w-4" />} value="$124,500" label="Total Revenue" change="22.4%" /><FinanceStat icon={<CalendarDays className="h-4 w-4" />} value="$18,750" label="This Month" change="15.6%" /><FinanceStat icon={<WalletCards className="h-4 w-4" />} value="$4,230" label="Pending Payouts" change="5.2%" /><FinanceStat icon={<RefreshCw className="h-4 w-4" />} value="$1,890" label="Refunds issued" change="-11.4%" negative /></div><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setActiveTab(tab.value); setPage(1) }} className={`rounded-full px-3 py-2 text-[10px] font-semibold transition ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] hover:bg-slate-50'}`}>{tab.label}<span className={`ml-2 rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span></button>)}</div><div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between"><label className="flex w-full max-w-[280px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search transactions</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search transaction ID, student..." /></label><div className="flex flex-wrap gap-2"><FilterSelect label="Date" value={date} onChange={setDate} options={['This Month', 'This Year', 'All Time']} icon={<CalendarDays className="h-3.5 w-3.5" />} /><FilterSelect label="Method" value={method} onChange={(value) => { setMethod(value); setPage(1) }} options={['All', 'Credit Card', 'PayPal', 'Bank Transfer']} /><FilterSelect label="Amount" value={amount} onChange={setAmount} options={['Any', 'Under $100', '$100 - $300', 'Over $300']} /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left text-[10px]"><thead><tr className="bg-[#f5f8fb] text-slate-600"><th className="px-3 py-3 font-semibold">Transaction ID</th><th className="px-3 py-3 font-semibold">Student</th><th className="px-3 py-3 font-semibold">Course</th><th className="px-3 py-3 font-semibold">Amount</th><th className="px-3 py-3 font-semibold">Payment Method</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Date</th><th className="px-3 py-3 font-semibold">Actions</th></tr></thead><tbody>{visibleTransactions.slice((page - 1) * 8, page * 8).map((transaction) => <tr key={transaction.id} className="border-b border-slate-100 text-[#1C1D52]"><td className="px-3 py-3.5 font-bold">{transaction.id}</td><td className="px-3 py-3.5 font-semibold">{transaction.student}</td><td className="max-w-[150px] truncate px-3 py-3.5 text-slate-500">{transaction.course}</td><td className="px-3 py-3.5 font-bold">{transaction.amount}</td><td className="px-3 py-3.5"><span className="inline-flex items-center gap-1"><CreditCard className="h-3 w-3" />{transaction.method}</span></td><td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[transaction.status]}`}>{transaction.status}</span></td><td className="px-3 py-3.5 text-slate-500">{transaction.date}</td><td className="px-3 py-3.5"><div className="flex items-center gap-2"><Link href={`/admin/student/payments/${transactionSlug(transaction.id)}/receipt`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">Receipt</Link><div className="relative"><button type="button" aria-label={`More actions for ${transaction.id}`} aria-expanded={openMenuId === transaction.id} onClick={() => setOpenMenuId(openMenuId === transaction.id ? null : transaction.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100"><MoreHorizontal className="inline h-3.5 w-3.5" /></button>{openMenuId === transaction.id && <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]"><Link href={`/admin/student/payments/${transactionSlug(transaction.id)}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View transaction</Link><Link href={`/admin/student/payments/${transactionSlug(transaction.id)}/receipt`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Receipt</Link><Link href={`/admin/student/payments/${transactionSlug(transaction.id)}/refund`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Refund request</Link></div>}</div></div></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleTransactions.length ? (page - 1) * 8 + 1 : 0}-{Math.min(page * 8, visibleTransactions.length)} of 2,340 transactions</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40"><ChevronLeft className="h-3 w-3" />Previous</button>{[1, 2, 3].map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 rounded-lg text-[10px] ${page === number ? 'bg-blue-500 text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{number}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8]">Next<ChevronRight className="h-3 w-3" /></button></div></div></section></div></AdminShell>
}

function FinanceStat({ icon, value, label, change, negative = false }: { icon: React.ReactNode; value: string; label: string; change: string; negative?: boolean }) {
  return <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><div className="flex items-start justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${negative ? 'bg-red-50 text-red-500' : 'bg-[#e8faf7] text-teal-500'}`}>{negative ? '▼' : '▲'} {change}</span></div><strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong><span className="mt-1 block text-[10px] text-slate-500">{label}</span></div>
}

function FilterSelect({ label, value, onChange, options, icon }: { label: string; value: string; onChange: (value: string) => void; options: string[]; icon?: React.ReactNode }) {
  return <label className="relative flex w-fit items-center"><span className="sr-only">Filter by {label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none"><option value={options[0]}>{label}: {options[0]}</option>{options.slice(1).map((option) => <option key={option} value={option}>{label}: {option}</option>)}</select>{icon ?? <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />}</label>
}

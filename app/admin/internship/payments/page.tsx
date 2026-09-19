'use client'

import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, WalletCards } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type PaymentRecord = {
  id: string
  transactionId: string
  intern: string
  email: string
  name: string
  track: string
  course: string
  tier: string
  amount: number
  amountLabel: string
  paymentType: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED'
  paymentStatusLabel: 'Pending' | 'Paid' | 'Failed' | 'Cancelled'
  internshipStatus: 'In Progress' | 'Completed' | 'Awaiting Next Course'
  paymentDate: string
  paymentDateLabel: string
  cohort: string
  cohortStatus: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | null
  courseFee: number
  accessFeeNote: string
  latestAttemptStatus: string | null
  latestAssessmentPercent: number | null
}

const statusStyles: Record<string, string> = {
  Paid: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Failed: 'bg-red-100 text-red-600',
  Cancelled: 'bg-slate-200 text-slate-600',
  'In Progress': 'bg-[#edf3ff] text-[#2c59c7]',
  Completed: 'bg-[#e8faf7] text-teal-600',
  'Awaiting Next Course': 'bg-[#fff0d8] text-amber-600',
}

const pageSize = 8

export default function InternshipPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [query, setQuery] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('All')
  const [internshipStatus, setInternshipStatus] = useState('All')
  const [course, setCourse] = useState('All')
  const [tier, setTier] = useState('All')
  const [track, setTrack] = useState('All')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/internship/payments', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Payments request failed (${response.status}).`)
        const payload = (await response.json()) as { payments?: PaymentRecord[] }
        setPayments(payload.payments ?? [])
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : 'Payment data is unavailable.')
      })
  }, [])

  const filters = useMemo(() => {
    const allCourses = Array.from(new Set(payments.map((item) => item.course))).sort()
    const allTracks = Array.from(new Set(payments.map((item) => item.track))).sort()
    const allTiers = Array.from(new Set(payments.map((item) => item.tier))).sort()

    return { allCourses, allTracks, allTiers }
  }, [payments])

  const filteredPayments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return payments.filter((item) => {
      const matchesQuery = !normalizedQuery || `${item.transactionId} ${item.intern} ${item.email} ${item.track} ${item.course} ${item.tier} ${item.paymentType}`.toLowerCase().includes(normalizedQuery)
      const matchesStatus = paymentStatus === 'All' || item.paymentStatusLabel === paymentStatus
      const matchesInternshipStatus = internshipStatus === 'All' || item.internshipStatus === internshipStatus
      const matchesCourse = course === 'All' || item.course === course
      const matchesTier = tier === 'All' || item.tier === tier
      const matchesTrack = track === 'All' || item.track === track

      return matchesQuery && matchesStatus && matchesInternshipStatus && matchesCourse && matchesTier && matchesTrack
    })
  }, [course, internshipStatus, paymentStatus, payments, query, tier, track])

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const visiblePayments = filteredPayments.slice((safePage - 1) * pageSize, safePage * pageSize)

  const summary = useMemo(() => {
    const totalPaid = payments.filter((item) => item.paymentStatus === 'PAID').length
    const totalAmount = payments.filter((item) => item.paymentStatus === 'PAID').reduce((sum, item) => sum + item.amount, 0)
    const inProgress = payments.filter((item) => item.internshipStatus === 'In Progress').length

    return {
      total: payments.length,
      paid: totalPaid,
      amount: totalAmount,
      inProgress,
    }
  }, [payments])

  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#5FBB46]">Finance operations</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Payments</h1>
            <p className="mt-2 text-xs text-slate-500">Monitor internship acceptance fees, tiered access payments, and the live internship status of each applicant.</p>
          </div>
          <div className="rounded-xl bg-[#edf3ff] px-3 py-2 text-right text-[#1C1D52]">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1C1D52]/70">Collected</p>
            <p className="mt-1 text-lg font-bold">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(summary.amount)}</p>
          </div>
        </header>

        <div className="grid gap-3 sm:grid-cols-4">
          <StatCard label="Total records" value={String(summary.total)} accent="blue" />
          <StatCard label="Paid" value={String(summary.paid)} accent="green" />
          <StatCard label="In progress" value={String(summary.inProgress)} accent="purple" />
          <StatCard label="Amount collected" value={new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(summary.amount)} accent="orange" />
        </div>

        {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{error}</p>}
        {!error && !payments.length && <p className="rounded-xl bg-white px-4 py-3 text-xs text-slate-500">Loading payment records…</p>}

        {payments.length > 0 && (
          <section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5">
            <div className="flex flex-col gap-3 pb-4 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex w-full max-w-[320px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400">
                <Search className="h-3.5 w-3.5" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search payment, intern, or track" />
              </label>

              <div className="flex flex-wrap gap-2">
                <FilterSelect label="Course" value={course} onChange={setCourse} options={['All', ...filters.allCourses]} />
                <FilterSelect label="Tier" value={tier} onChange={setTier} options={['All', ...filters.allTiers]} />
                <FilterSelect label="Track" value={track} onChange={setTrack} options={['All', ...filters.allTracks]} />
                <FilterSelect label="Payment status" value={paymentStatus} onChange={setPaymentStatus} options={['All', 'Paid', 'Pending', 'Failed', 'Cancelled']} />
                <FilterSelect label="Internship status" value={internshipStatus} onChange={setInternshipStatus} options={['All', 'In Progress', 'Completed', 'Awaiting Next Course']} />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1400px] border-collapse text-left text-[10px]">
                <thead>
                  <tr className="bg-[#f5f8fb] text-slate-600">
                    <th className="px-3 py-3 font-semibold">Payment / ID</th>
                    <th className="px-3 py-3 font-semibold">Intern</th>
                    <th className="px-3 py-3 font-semibold">Name</th>
                    <th className="px-3 py-3 font-semibold">Track</th>
                    <th className="px-3 py-3 font-semibold">Tier</th>
                    <th className="px-3 py-3 font-semibold">Amount paid</th>
                    <th className="px-3 py-3 font-semibold">Payment type</th>
                    <th className="px-3 py-3 font-semibold">Payment status</th>
                    <th className="px-3 py-3 font-semibold">Course</th>
                    <th className="px-3 py-3 font-semibold">Payment date</th>
                    <th className="px-3 py-3 font-semibold">Internship status</th>
                    <th className="px-3 py-3 font-semibold">Extra info</th>
                    <th className="px-3 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-slate-100 align-top text-[#1C1D52]">
                      <td className="px-3 py-3.5">
                        <div>
                          <p className="font-bold text-[#1C1D52]">{payment.transactionId}</p>
                          <p className="mt-1 text-[9px] text-slate-500">{payment.id}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.intern}</td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.name}</td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.track}</td>
                      <td className="px-3 py-3.5">
                        <span className="rounded-full bg-[#eef4ff] px-2 py-1 font-semibold text-[#1C1D52]">{payment.tier}</span>
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-[#1C1D52]">{payment.amountLabel}</td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.paymentType}</td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[payment.paymentStatusLabel]}`}>{payment.paymentStatusLabel}</span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.course}</td>
                      <td className="px-3 py-3.5 text-slate-600">{payment.paymentDateLabel}</td>
                      <td className="px-3 py-3.5">
                        <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[payment.internshipStatus]}`}>{payment.internshipStatus}</span>
                      </td>
                      <td className="px-3 py-3.5 text-slate-600">
                        <div className="space-y-1">
                          <p>{payment.cohort}</p>
                          <p className="text-[9px] text-slate-500">{payment.accessFeeNote}</p>
                        </div>
                      </td>
                      <td className="relative px-3 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/internship/payments/${payment.id}`} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]">View</Link>
                          <button type="button" aria-label={`More actions for ${payment.id}`} onClick={() => setOpenMenuId(openMenuId === payment.id ? null : payment.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100">
                            <MoreHorizontal className="inline h-3.5 w-3.5" />
                          </button>
                        </div>
                        {openMenuId === payment.id && (
                          <div className="absolute right-0 z-10 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]">
                            <Link href={`/admin/internship/payments/${payment.id}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">View payment</Link>
                            <Link href={`/admin/internship/payments/${payment.id}/receipt`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]">Receipt</Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredPayments.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, filteredPayments.length)} of {filteredPayments.length} payments
              </span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40">
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 rounded-lg text-[10px] ${safePage === number ? 'bg-[#1C1D52] text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}>
                    {number}
                  </button>
                ))}
                <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage === totalPages} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40">
                  Next
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </AdminShell>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative flex w-fit items-center">
      <span className="sr-only">Filter by {label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{label}: {option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" />
    </label>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: 'blue' | 'green' | 'purple' | 'orange' }) {
  const accentMap = {
    blue: 'bg-[#edf3ff] text-[#2c59c7]',
    green: 'bg-[#e8faf7] text-[#1a8d73]',
    purple: 'bg-[#f2ecff] text-[#5d49c6]',
    orange: 'bg-[#fff0d8] text-[#b66b00]',
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentMap[accent]}`}>
        <WalletCards className="h-4 w-4" />
      </div>
      <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-[#1C1D52]">{value}</p>
    </div>
  )
}

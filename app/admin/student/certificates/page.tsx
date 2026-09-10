'use client'

import { Award, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, Edit3, Eye, MoreHorizontal, Search, ShieldAlert, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type CertificateStatus = 'Issued' | 'Pending' | 'Revoked'
type Certificate = { id: string; student: string; course: string; issued: string; expiry: string; status: CertificateStatus; code: string }

function certificateSlug(certificateId: string) {
  return certificateId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const initialCertificates: Certificate[] = [
  { id: '#CERT-902', student: 'Emma Thompson', course: 'Web Development', issued: '2025-02-05', expiry: 'No Expiry', status: 'Issued', code: 'WDB-9204A' },
  { id: '#CERT-901', student: 'James Wilson', course: 'Data Science Fundamentals', issued: '2025-02-01', expiry: '2027-02-01', status: 'Issued', code: 'DSF-1849D' },
  { id: '#CERT-900', student: 'Noah Kim', course: 'Machine Learning', issued: '2025-01-28', expiry: 'No Expiry', status: 'Issued', code: 'MLM-3958K' },
  { id: '#CERT-899', student: 'Liam Chen', course: 'UI/UX Design Mastery', issued: '2025-01-20', expiry: 'No Expiry', status: 'Pending', code: 'UID-8495L' },
  { id: '#CERT-898', student: 'Ava Martinez', course: 'iOS App Development', issued: '2025-01-15', expiry: 'No Expiry', status: 'Revoked', code: 'IOS-2849M' },
  { id: '#CERT-897', student: 'Olivia Patel', course: 'Digital Marketing', issued: '2025-01-10', expiry: 'No Expiry', status: 'Issued', code: 'DMB-4859P' },
  { id: '#CERT-896', student: 'Siddharth Sen', course: 'Python Programming', issued: '2025-01-08', expiry: 'No Expiry', status: 'Issued', code: 'PYT-9204S' },
  { id: '#CERT-895', student: 'Alice Springs', course: 'Advanced React', issued: '2025-01-05', expiry: '2026-01-05', status: 'Issued', code: 'ARP-1049A' },
]

const statusStyles: Record<CertificateStatus, string> = {
  Issued: 'bg-[#e8faf7] text-teal-600',
  Pending: 'bg-[#fff0d8] text-orange-600',
  Revoked: 'bg-red-100 text-red-500',
}

export default function AdminCertificatesPage() {
  const [certificateRows, setCertificateRows] = useState<Certificate[]>(initialCertificates)
  const [activeTab, setActiveTab] = useState<'All' | CertificateStatus>('All')
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('All')
  const [student, setStudent] = useState('All')
  const [date, setDate] = useState('All Time')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const tabs: { label: string; value: 'All' | CertificateStatus; count: number }[] = [
    { label: 'All', value: 'All', count: certificateRows.length },
    { label: 'Issued', value: 'Issued', count: certificateRows.filter((item) => item.status === 'Issued').length },
    { label: 'Pending', value: 'Pending', count: certificateRows.filter((item) => item.status === 'Pending').length },
    { label: 'Revoked', value: 'Revoked', count: certificateRows.filter((item) => item.status === 'Revoked').length },
  ]

  const visibleCertificates = useMemo(() => certificateRows.filter((certificate) => {
    const matchesTab = activeTab === 'All' || certificate.status === activeTab
    const searchValue = `${certificate.id} ${certificate.student} ${certificate.course} ${certificate.code}`.toLowerCase()
    return matchesTab && searchValue.includes(query.toLowerCase())
  }), [activeTab, certificateRows, query])

  const handleGetPdf = (certificate: Certificate) => {
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
                <p class="description">Awarded for successful completion of the ${certificate.course} program with strong academic and practical performance.</p>
              </div>

              <div class="panel">
                <div class="rows">
                  <div class="row"><span>Student</span><strong>${certificate.student}</strong></div>
                  <div class="row"><span>Course</span><strong>${certificate.course}</strong></div>
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

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${certificateSlug(certificate.id)}.html`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <AdminShell workspace="student"><div className="mx-auto max-w-[1400px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Certificates Registry</h1><p className="mt-2 text-xs text-slate-500">Generate, manage templates, verify cryptography codes, and track completions</p></div><div className="flex flex-wrap gap-2"><Link href="/admin/student/certificates/templates" className="rounded-lg bg-white px-4 py-2.5 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8]">Certificate Templates</Link><Link href="/admin/student/certificates/new" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f] hover:bg-[#4aaa3e]"><Award className="h-3.5 w-3.5" />Issue Certificate</Link></div></header><div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><CertificateStat icon={<Award className="h-4 w-4" />} value="1,890" label="Total Issued" change="15.2%" /><CertificateStat icon={<CalendarDays className="h-4 w-4" />} value="156" label="Issued This Month" change="9.8%" /><CertificateStat icon={<Clock3 className="h-4 w-4" />} value="23" label="Pending Approval" change="4.1%" /><CertificateStat icon={<ShieldAlert className="h-4 w-4" />} value="8" label="Revoked" change="-50%" negative /></div><section className="rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-5"><div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => { setActiveTab(tab.value); setPage(1) }} className={`rounded-full px-3 py-2 text-[10px] font-semibold transition ${activeTab === tab.value ? 'bg-blue-500 text-white' : 'text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] hover:bg-slate-50'}`}>{tab.label}<span className={`ml-2 rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span></button>)}</div><div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between"><label className="flex w-full max-w-[260px] items-center gap-2 rounded-lg bg-[#f3f6fb] px-3 py-2.5 text-xs text-slate-400"><Search className="h-3.5 w-3.5" /><span className="sr-only">Search certificates</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} className="w-full bg-transparent outline-none placeholder:text-slate-400" placeholder="Search certificate ID, student..." /></label><div className="flex flex-wrap gap-2"><FilterSelect label="Course" value={course} onChange={setCourse} options={['All', 'Web Development', 'Data Science', 'Design']} /><FilterSelect label="Student" value={student} onChange={setStudent} options={['All', 'Emma Thompson', 'James Wilson', 'Noah Kim']} /><FilterSelect label="Date" value={date} onChange={setDate} options={['All Time', 'This Month', 'This Year']} /></div></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left text-[10px]"><thead><tr className="bg-[#f5f8fb] text-slate-600"><th className="px-3 py-3 font-semibold">Certificate ID</th><th className="px-3 py-3 font-semibold">Student</th><th className="px-3 py-3 font-semibold">Course</th><th className="px-3 py-3 font-semibold">Issue Date</th><th className="px-3 py-3 font-semibold">Expiry Date</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Verification Code</th><th className="px-3 py-3 font-semibold">Actions</th></tr></thead><tbody>{visibleCertificates.slice((page - 1) * 8, page * 8).map((certificate) => <tr key={certificate.id} className="border-b border-slate-100 text-[#1C1D52]"><td className="px-3 py-3.5 font-bold">{certificate.id}</td><td className="px-3 py-3.5 font-semibold">{certificate.student}</td><td className="max-w-[150px] truncate px-3 py-3.5 font-semibold">{certificate.course}</td><td className="px-3 py-3.5 text-slate-500">{certificate.issued}</td><td className="px-3 py-3.5 text-slate-500">{certificate.expiry}</td><td className="px-3 py-3.5"><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[certificate.status]}`}>{certificate.status}</span></td><td className="px-3 py-3.5 font-bold">{certificate.code}</td><td className="relative px-3 py-3.5"><div className="flex items-center gap-2"><button type="button" onClick={() => handleGetPdf(certificate)} className="rounded bg-[#f3f6fb] px-2 py-1 text-[9px] font-semibold text-[#1C1D52] hover:bg-[#e8edf7]"><Download className="mr-1 inline h-3 w-3" />Get PDF</button><div className="relative"><button type="button" aria-label={`More actions for ${certificate.id}`} onClick={() => setOpenMenuId(openMenuId === certificate.id ? null : certificate.id)} className="rounded p-1 text-[#1C1D52] hover:bg-slate-100"><MoreHorizontal className="inline h-3.5 w-3.5" /></button>{openMenuId === certificate.id && <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-[0_8px_20px_rgba(28,29,82,0.16)]"><Link href={`/admin/student/certificates/${certificateSlug(certificate.id)}`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]"><Eye className="h-3.5 w-3.5" />View</Link><Link href={`/admin/student/certificates/${certificateSlug(certificate.id)}/edit`} onClick={() => setOpenMenuId(null)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-[#1C1D52] hover:bg-[#f3f6fb]"><Edit3 className="h-3.5 w-3.5" />Edit</Link><button type="button" onClick={() => { setCertificateRows((current) => current.filter((item) => item.id !== certificate.id)); setOpenMenuId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] font-medium text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div>}</div></div></td></tr>)}</tbody></table></div><div className="flex flex-col gap-3 pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Showing {visibleCertificates.length ? (page - 1) * 8 + 1 : 0}-{Math.min(page * 8, visibleCertificates.length)} of 1,890 certificates</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-40"><ChevronLeft className="h-3 w-3" />Previous</button>{[1, 2, 3].map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`h-8 w-8 rounded-lg text-[10px] ${page === number ? 'bg-blue-500 text-white' : 'shadow-[inset_0_0_0_1px_#d8dee8]'}`}>{number}</button>)}<button type="button" onClick={() => setPage((current) => current + 1)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 shadow-[inset_0_0_0_1px_#d8dee8]">Next<ChevronRight className="h-3 w-3" /></button></div></div></section></div></AdminShell>
}

function CertificateStat({ icon, value, label, change, negative = false }: { icon: React.ReactNode; value: string; label: string; change: string; negative?: boolean }) {
  return <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><div className="flex items-start justify-between"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span><span className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${negative ? 'bg-red-50 text-red-500' : 'bg-[#e8faf7] text-teal-500'}`}>{negative ? '▼' : '▲'} {change}</span></div><strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong><span className="mt-1 block text-[10px] text-slate-500">{label}</span></div>
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="relative flex w-fit items-center"><span className="sr-only">Filter by {label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 appearance-none rounded-lg px-3 pr-8 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#d8dee8] outline-none"><option value={options[0]}>{label}: {options[0]}</option>{options.slice(1).map((option) => <option key={option} value={option}>{label}: {option}</option>)}</select><ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-slate-500" /></label>
}

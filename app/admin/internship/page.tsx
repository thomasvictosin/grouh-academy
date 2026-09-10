import Link from 'next/link'
import { Activity, ArrowUpRight, BriefcaseBusiness, CheckCircle2, ClipboardCheck, Clock3, Users, WalletCards } from 'lucide-react'
import AdminShell from '@/components/AdminShell'

const stats = [
  { value: '248', label: 'Active interns', icon: Users, detail: '+18 this month' },
  { value: '36', label: 'Open applications', icon: ClipboardCheck, detail: '9 new this week' },
  { value: '12', label: 'Live assessments', icon: CheckCircle2, detail: '4 due this week' },
  { value: '18', label: 'Active mentors', icon: BriefcaseBusiness, detail: '2 on leave' },
] as const

export default function InternshipAdminDashboard() {
  return (
    <AdminShell workspace="internship">
      <div className="mx-auto max-w-[1400px] space-y-5">
        <section className="rounded-[28px] bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_30px_rgba(95,187,70,0.2)] sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#14204f]/70">Internship admin workspace</p>
              <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Internship Dashboard Overview</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/internship/applications" className="rounded-lg bg-white px-4 py-2.5 text-[10px] font-semibold text-[#14204f]">Review applications</Link>
              <Link href="/admin/internship/assessments/new" className="rounded-lg bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white">Create assessment</Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {stats.map(({ value, label, icon: Icon, detail }) => (
            <div key={label} className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[8px] font-semibold text-[#5FBB46]">{detail}</span>
              </div>
              <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
              <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Assessment pipeline</h2>
                <p className="mt-1 text-[10px] text-slate-500">Current progress across internship assessment tracks.</p>
              </div>
              <Link href="/admin/internship/assessments" className="text-[10px] font-bold text-[#5FBB46]">View all</Link>
            </div>

            <div className="mt-5 space-y-4">
              {[
                ['Software Development', '78%', 'bg-[#5FBB46]'],
                ['Product Design', '64%', 'bg-blue-500'],
                ['Data Analytics', '52%', 'bg-[#f0be43]'],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#1C1D52]">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${color}`} style={{ width: value }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-[#1C1D52] p-5 text-white shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9be28a]">Priority</p>
            <h2 className="mt-3 text-xl font-bold">Coordinator summary</h2>

            <div className="mt-5 space-y-3">
              {[
                ['12 submitted assignments need review', '/admin/internship/applications'],
                ['4 mentor check-ins are due this week', '/admin/internship/mentors'],
                ['3 payments are pending verification', '/admin/internship/payments'],
              ].map(([label, href]) => (
                <Link key={label} href={href} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3 text-[10px] font-medium text-white/85">
                  <span>{label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Recent activity</h2>
                <p className="mt-1 text-[10px] text-slate-500">Latest internship updates across applications and mentor workflows.</p>
              </div>
              <Link href="/admin/internship/notifications" className="text-[10px] font-bold text-[#5FBB46]">View all</Link>
            </div>

            <div className="mt-5 space-y-3">
              {[
                ['Application reviewed for Chinedu Adebayo', 'Product Design • 45 minutes ago'],
                ['Assessment Alpha opened for 27 interns', 'Mentors assigned • 2 hours ago'],
                ['Payment verified for Ada Nwosu', 'Software Development • Today'],
                ['Mentor feedback submitted for Samuel Ojo', 'Data Analytics • Yesterday'],
              ].map(([title, meta]) => (
                <div key={title} className="flex items-start gap-3 rounded-xl bg-[#f8fbff] p-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f7eb] text-[#5FBB46]">
                    <Activity className="h-3 w-3" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1D52]">{title}</p>
                    <p className="mt-1 text-[10px] text-slate-500">{meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Mentor load</h2>
                <p className="mt-1 text-[10px] text-slate-500">Mentor capacity across the internship programs.</p>
              </div>
              <Link href="/admin/internship/mentors" className="text-[10px] font-bold text-[#5FBB46]">Open mentors</Link>
            </div>

            <div className="mt-5 space-y-4">
              {[
                ['Maya Brooks', 'Software Development', '7 interns', 'High'],
                ['Daniel Oke', 'Product Design', '5 interns', 'Balanced'],
                ['Ada Smith', 'Data Analytics', '9 interns', 'Near capacity'],
              ].map(([name, track, interns, status]) => (
                <div key={name} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#1C1D52]">{name}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{track}</p>
                    </div>
                    <span className="rounded-full bg-[#e8f7eb] px-2 py-1 text-[9px] font-semibold text-[#397d3a]">{status}</span>
                  </div>
                  <div className="mt-3 flex justify-between text-[10px] text-slate-500">
                    <span>{interns}</span>
                    <span className="font-semibold text-[#1C1D52]">{status === 'High' ? '74%' : status === 'Balanced' ? '58%' : '88%'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  )
}

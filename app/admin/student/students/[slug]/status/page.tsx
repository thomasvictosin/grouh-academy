import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

const studentNames: Record<string, string> = {
  'emma-thompson': 'Emma Thompson',
  'james-wilson': 'James Wilson',
  'sofia-rodriguez': 'Sofia Rodriguez',
  'liam-chen': 'Liam Chen',
  'olivia-patel': 'Olivia Patel',
  'noah-kim': 'Noah Kim',
  'ava-martinez': 'Ava Martinez',
  'ethan-brooks': 'Ethan Brooks',
  'mia-turner': 'Mia Turner',
}

const statuses = [
  { name: 'Active', description: 'Student can sign in and access enrolled courses.', icon: CheckCircle2, color: 'text-teal-600 bg-[#e8faf7]' },
  { name: 'Inactive', description: 'Keep the account but pause normal learning access.', icon: ShieldAlert, color: 'text-slate-500 bg-slate-100' },
  { name: 'Suspended', description: 'Temporarily restrict access while preserving the account.', icon: ShieldAlert, color: 'text-orange-600 bg-[#fff0d8]' },
  { name: 'Blocked', description: 'Prevent sign-in and all account activity.', icon: ShieldAlert, color: 'text-red-500 bg-red-100' },
]

export default async function ChangeStudentStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = studentNames[slug] ?? 'Student'

  return <AdminShell workspace="student"><div className="mx-auto max-w-[760px] space-y-5"><Link href={`/admin/student/students/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to Student Profile</Link><header><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Change Student Status</h1><p className="mt-2 text-xs text-slate-500">Choose the account access status for {name}.</p></header><form className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><fieldset><legend className="text-sm font-bold text-[#1C1D52]">Account Status</legend><div className="mt-5 space-y-3">{statuses.map(({ name: status, description, icon: Icon, color }) => <label key={status} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition has-[:checked]:border-blue-400 has-[:checked]:bg-[#f8fbff]"><input type="radio" name="status" value={status} defaultChecked={status === 'Active'} className="mt-1 accent-blue-500" /><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-4 w-4" /></span><span><strong className="block text-xs text-[#1C1D52]">{status}</strong><span className="mt-1 block text-[10px] text-slate-500">{description}</span></span></label>)}</div></fieldset><div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><Link href={`/admin/student/students/${slug}`} className="rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-[inset_0_0_0_1px_#d8dee8]">Cancel</Link><button type="submit" className="rounded-lg bg-[#1C1D52] px-4 py-2.5 text-xs font-semibold text-white">Update Status</button></div></form></div></AdminShell>
}

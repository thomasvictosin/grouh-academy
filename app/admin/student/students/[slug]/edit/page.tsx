import { ArrowLeft, Save } from 'lucide-react'
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

export default async function EditStudentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = studentNames[slug] ?? 'Student'
  const [firstName, ...lastName] = name.split(' ')

  return <AdminShell workspace="student"><div className="mx-auto max-w-[900px] space-y-5"><Link href={`/admin/student/students/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to Student Profile</Link><header><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Edit Student</h1><p className="mt-2 text-xs text-slate-500">Update {name}&apos;s account and academic information.</p></header><form className="space-y-5"><section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Personal Information</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="First Name" defaultValue={firstName} /><Field label="Last Name" defaultValue={lastName.join(' ')} /><Field label="Email Address" defaultValue={`${firstName.toLowerCase()}.${lastName.join('').toLowerCase()}@gmail.com`} type="email" /><Field label="Phone Number" defaultValue="+1 (555) 382-1142" /></div><label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">Bio / About<textarea rows={4} defaultValue="Passionate learner focused on building practical skills through project-based coursework." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" /></label></section><section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Academic Details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Program / Major" defaultValue="B.S. in Computer Science" /><Field label="Student ID" defaultValue={`GROUH-${slug.slice(0, 5).toUpperCase()}`} /><label className="block text-[10px] font-semibold text-[#1C1D52]">Enrollment Status<select defaultValue="Active" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400"><option>Active</option><option>Inactive</option><option>Suspended</option><option>Blocked</option></select></label></div></section><div className="flex flex-wrap justify-end gap-3"><Link href={`/admin/student/students/${slug}`} className="rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-[inset_0_0_0_1px_#d8dee8]">Cancel</Link><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]"><Save className="h-4 w-4" />Save Changes</button></div></form></div></AdminShell>
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return <label className="block text-[10px] font-semibold text-[#1C1D52]">{label}<input type={type} defaultValue={defaultValue} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" /></label>
}

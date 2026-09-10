import { ArrowLeft, Award, BookOpen, CalendarDays, Clock, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

type StudentProfile = {
  name: string
  email: string
  courses: number
  completed: number
  certificates: number
  status: 'Active' | 'Inactive' | 'Suspended' | 'Blocked'
  joined: string
  location: string
  phone: string
  program: string
  lastActive: string
  bio: string
}

const studentProfiles: Record<string, StudentProfile> = {
  'emma-thompson': { name: 'Emma Thompson', email: 'emma.t@gmail.com', courses: 4, completed: 2, certificates: 2, status: 'Active', joined: 'January 10, 2025', location: 'San Francisco, California', phone: '+1 (555) 382-1142', program: 'B.S. in Computer Science', lastActive: '2 mins ago', bio: 'Emma is building a strong foundation in software development through practical coursework and project-based learning.' },
  'james-wilson': { name: 'James Wilson', email: 'j.wilson@hotmail.com', courses: 6, completed: 5, certificates: 4, status: 'Active', joined: 'January 12, 2025', location: 'London, United Kingdom', phone: '+1 (555) 409-6302', program: 'Full-Stack Development', lastActive: '1 hour ago', bio: 'James is an engaged learner focused on turning advanced web development concepts into production-ready projects.' },
  'sofia-rodriguez': { name: 'Sofia Rodriguez', email: 'sofia.r@outlook.com', courses: 3, completed: 0, certificates: 0, status: 'Inactive', joined: 'February 1, 2025', location: 'Austin, Texas', phone: '+1 (555) 392-1458', program: 'UI/UX Design', lastActive: '3 days ago', bio: 'Sofia is exploring user research, visual design, and accessible digital products.' },
  'liam-chen': { name: 'Liam Chen', email: 'liam.chen@tech.io', courses: 5, completed: 4, certificates: 3, status: 'Active', joined: 'January 15, 2025', location: 'Seattle, Washington', phone: '+1 (555) 614-2290', program: 'Data Science', lastActive: '12 mins ago', bio: 'Liam enjoys applying data analysis and programming to practical problems.' },
  'olivia-patel': { name: 'Olivia Patel', email: 'olivia.p@gmail.com', courses: 2, completed: 1, certificates: 1, status: 'Suspended', joined: 'January 20, 2025', location: 'Chicago, Illinois', phone: '+1 (555) 271-8813', program: 'Digital Marketing', lastActive: '1 week ago', bio: 'Olivia is developing a practical understanding of content strategy and digital experiences.' },
  'noah-kim': { name: 'Noah Kim', email: 'noah.kim@naver.com', courses: 7, completed: 3, certificates: 2, status: 'Active', joined: 'January 5, 2025', location: 'New York, New York', phone: '+1 (555) 703-5521', program: 'Python Programming', lastActive: '5 mins ago', bio: 'Noah is expanding his programming skills across Python, automation, and backend development.' },
  'ava-martinez': { name: 'Ava Martinez', email: 'ava.m@yahoo.com', courses: 4, completed: 4, certificates: 4, status: 'Active', joined: 'January 18, 2025', location: 'Miami, Florida', phone: '+1 (555) 231-9044', program: 'Web Development', lastActive: '45 mins ago', bio: 'Ava has completed her current learning path and continues to sharpen her frontend skills.' },
  'ethan-brooks': { name: 'Ethan Brooks', email: 'e.brooks@gmail.com', courses: 1, completed: 0, certificates: 0, status: 'Blocked', joined: 'February 14, 2025', location: 'Boston, Massachusetts', phone: '+1 (555) 555-1840', program: 'Web Development', lastActive: '2 weeks ago', bio: 'Ethan recently joined the academy and has started his introductory web development course.' },
  'mia-turner': { name: 'Mia Turner', email: 'mia.turner@gmail.com', courses: 3, completed: 1, certificates: 0, status: 'Active', joined: 'February 18, 2025', location: 'Portland, Oregon', phone: '+1 (555) 555-7612', program: 'UI/UX Design', lastActive: '30 mins ago', bio: 'Mia is learning to connect thoughtful interface design with clear user goals.' },
}

const statusStyles = {
  Active: 'bg-[#e8faf7] text-teal-600',
  Inactive: 'bg-slate-100 text-slate-500',
  Suspended: 'bg-[#fff0d8] text-orange-600',
  Blocked: 'bg-red-100 text-red-500',
}

export default async function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const student = studentProfiles[slug] ?? studentProfiles['emma-thompson']
  const completion = student.courses ? Math.round((student.completed / student.courses) * 100) : 0
  const certificateRate = student.courses ? Math.round((student.certificates / student.courses) * 100) : 0

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <Link href="/admin/student/students" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to Students</Link>
        <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:flex-row sm:items-center sm:p-7">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#dceeff] text-2xl font-bold text-blue-600">{student.name.split(' ').map((part) => part[0]).join('')}</div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold text-[#1C1D52]">{student.name}</h1><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${statusStyles[student.status]}`}>{student.status}</span></div><p className="mt-1 text-sm text-slate-500">{student.program}</p><p className="mt-2 flex items-center gap-2 text-[10px] text-slate-500"><MapPin className="h-3.5 w-3.5" />{student.location}</p></div>
          <Link href={`/admin/student/students/${slug}/edit`} className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">Edit Profile</Link>
        </section>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><ProfileStat icon={<BookOpen className="h-4 w-4" />} value={String(student.courses)} label="Enrolled Courses" /><ProfileStat icon={<Clock className="h-4 w-4" />} value={String(student.completed)} label="Completed Courses" /><ProfileStat icon={<Award className="h-4 w-4" />} value={String(student.certificates)} label="Certificates Earned" /><ProfileStat icon={<CalendarDays className="h-4 w-4" />} value={student.lastActive} label="Last Active" /></div>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Personal Information</h2><dl className="mt-4 space-y-4 text-[10px]"><InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email Address" value={student.email} /><InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone Number" value={student.phone} /><InfoRow icon={<CalendarDays className="h-3.5 w-3.5" />} label="Joined Academy" value={student.joined} /><div><dt className="uppercase text-slate-400">Bio / About</dt><dd className="mt-1 leading-4 text-slate-600">{student.bio}</dd></div></dl></section>
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Learning Overview</h2><div className="mt-5 space-y-4"><ProgressRow label="Course completion" value={completion} /><ProgressRow label="Certificates earned" value={certificateRate} /></div><div className="mt-6 rounded-xl bg-[#f3f6fb] p-4"><p className="text-[9px] uppercase text-slate-400">Current program</p><p className="mt-1 text-sm font-semibold text-[#1C1D52]">{student.program}</p></div></section>
        </div>
      </div>
    </AdminShell>
  )
}

function ProfileStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span><strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong><span className="mt-1 block text-[10px] text-slate-500">{label}</span></div>
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div><dt className="flex items-center gap-2 uppercase text-slate-400">{icon}{label}</dt><dd className="mt-1 font-semibold text-[#1C1D52]">{value}</dd></div>
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return <div><div className="flex justify-between text-[10px] font-semibold text-[#1C1D52]"><span>{label}</span><span>{value}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#5FBB46]" style={{ width: `${value}%` }} /></div></div>
}

import { ArrowLeft, Award, BookOpen, CalendarDays, Mail, MapPin, Phone, Star, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { RoleName } from '@/generated/prisma/client'
import { getPrisma } from '@/lib/prisma'

export default async function InstructorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const instructor = await getPrisma().user.findFirst({
    where: {
      id: slug,
      roles: { some: { role: { name: RoleName.INSTRUCTOR } } },
    },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      profile: { select: { firstName: true, lastName: true, phone: true, country: true, state: true, bio: true } },
      instructorProfile: { select: { expertise: true, qualification: true, bio: true, status: true } },
      createdCourses: {
        select: {
          _count: { select: { enrollments: true } },
        },
      },
      courseInstructors: {
        select: {
          course: { select: { _count: { select: { enrollments: true } } } },
        },
      },
    },
  })

  if (!instructor) {
    notFound()
  }

  const name = instructor.name || [instructor.profile?.firstName, instructor.profile?.lastName].filter(Boolean).join(' ') || 'Unnamed instructor'
  const status = instructor.status === 'SUSPENDED' ? 'Suspended' : instructor.instructorProfile?.status === 'PENDING' ? 'Pending' : 'Active'
  const specialty = instructor.instructorProfile?.expertise || 'General instruction'
  const students = instructor.courseInstructors.reduce((sum, item) => sum + (item.course?._count?.enrollments ?? 0), 0) + instructor.createdCourses.reduce((sum, item) => sum + (item._count?.enrollments ?? 0), 0)

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <Link href="/admin/student/instructors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />Back to Instructors
        </Link>

        <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:flex-row sm:items-center sm:p-7">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#dceeff] text-2xl font-bold text-blue-600">
            {name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#1C1D52]">{name}</h1>
              <span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${status === 'Active' ? 'bg-[#e8faf7] text-teal-600' : status === 'Pending' ? 'bg-[#fff4c8] text-amber-600' : 'bg-red-50 text-red-500'}`}>
                {status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{specialty} Instructor</p>
            <p className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {instructor.profile?.country || instructor.profile?.state || 'Remote'}
            </p>
          </div>

          <Link href={`/admin/student/instructors/${slug}/edit`} className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
            Edit Profile
          </Link>
        </section>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <ProfileStat icon={<Star className="h-4 w-4" />} value="4.8" label="Average Rating" />
          <ProfileStat icon={<BookOpen className="h-4 w-4" />} value={String(instructor.createdCourses.length + instructor.courseInstructors.length)} label="Published Courses" />
          <ProfileStat icon={<Users className="h-4 w-4" />} value={String(students)} label="Total Students" />
          <ProfileStat icon={<Award className="h-4 w-4" />} value="₦0" label="Revenue Earned" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
            <h2 className="text-sm font-bold text-[#1C1D52]">About</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {instructor.instructorProfile?.bio || instructor.profile?.bio || 'This instructor has not added a profile biography yet.'}
            </p>
          </section>

          <aside className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <h2 className="text-sm font-bold text-[#1C1D52]">Contact</h2>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500" />{instructor.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-500" />{instructor.profile?.phone || 'No phone provided'}</p>
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-500" />Joined {new Date(instructor.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </section>

            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
              <h2 className="text-sm font-bold text-[#1C1D52]">Teaching overview</h2>
              <div className="mt-4 space-y-2">
                <p className="flex items-center justify-between text-[10px] text-slate-500"><span>Course completion</span><strong className="text-[#1C1D52]">94%</strong></p>
                <p className="flex items-center justify-between text-[10px] text-slate-500"><span>Average assignment score</span><strong className="text-[#1C1D52]">89%</strong></p>
                <p className="flex items-center justify-between text-[10px] text-slate-500"><span>Response time</span><strong className="text-[#1C1D52]">3h</strong></p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AdminShell>
  )
}

function ProfileStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span>
      <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
      <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
    </div>
  )
}

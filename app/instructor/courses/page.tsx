import Link from 'next/link'
import { InstructorPage } from '@/components/InstructorPage'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

export default async function InstructorCoursesPage() {
  const userId = await getCurrentUserId()
  const courses = userId && !userId.startsWith('dev:') ? await getPrisma().course.findMany({ where: { OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }] }, include: { category: true, _count: { select: { enrollments: true, modules: true } } }, orderBy: { updatedAt: 'desc' } }) : []
  return <InstructorPage title="My Courses" description="Build course content, save drafts, and submit completed courses for admin review." action={{ label: 'Create course', href: '/instructor/courses/new' }}><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><h2 className="text-sm font-bold text-[#1C1D52]">Course library</h2><span className="rounded-full bg-[#e8f7eb] px-3 py-1 text-[10px] font-bold text-[#397d3a]">{courses.length} courses</span></div><div className="mt-5 space-y-3">{courses.map((course) => <article key={course.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><Link href={`/instructor/courses/${course.slug}`} className="text-sm font-bold text-[#1C1D52] hover:text-blue-600">{course.title}</Link><p className="mt-1 text-[10px] text-slate-500">{course.category?.name ?? 'Uncategorized'} · {course._count.modules} modules · {course._count.enrollments} students</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">{course.status}</span></article>)}{courses.length === 0 && <p className="py-10 text-center text-xs text-slate-500">No courses yet. Create your first draft.</p>}</div></section></InstructorPage>
}

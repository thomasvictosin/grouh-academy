import { ArrowLeft, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminShell from '@/components/AdminShell'
import { getCourseBySlug } from '@/lib/course-data'

export default async function AdminCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()
  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  return <AdminShell workspace="student"><div className="mx-auto max-w-[1100px] space-y-5"><Link href="/admin/student/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Back to Courses</Link><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-600">{course.status}</span><h1 className="mt-4 text-2xl font-bold text-[#1C1D52] sm:text-3xl">{course.title}</h1><p className="mt-2 text-sm text-slate-500">{course.category?.name ?? 'Uncategorized'} · {course.instructors[0]?.instructor.name ?? course.creator.name ?? 'Grouh Academy'}</p><p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">{course.description ?? 'No description provided.'}</p></section><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 shadow-sm"><Users className="h-5 w-5 text-blue-500" /><strong className="mt-3 block text-xl text-[#1C1D52]">{course._count.enrollments}</strong><span className="text-xs text-slate-500">Enrolled students</span></div><div className="rounded-2xl bg-white p-5 shadow-sm"><BookOpen className="h-5 w-5 text-[#5FBB46]" /><strong className="mt-3 block text-xl text-[#1C1D52]">{lessonCount}</strong><span className="text-xs text-slate-500">Lessons</span></div><div className="rounded-2xl bg-white p-5 shadow-sm"><strong className="block text-xl text-[#1C1D52]">{course.currency} {course.price}</strong><span className="text-xs text-slate-500">Course price</span></div></div><section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Curriculum</h2><div className="mt-4 space-y-2">{course.modules.map((module) => <div key={module.id} className="rounded-xl bg-[#f8fbff] px-4 py-3"><p className="text-xs font-semibold text-[#1C1D52]">{module.title}</p><p className="mt-1 text-[10px] text-slate-500">{module.lessons.length} lessons</p></div>)}</div></section></div></AdminShell>
}

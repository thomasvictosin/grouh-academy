import Link from 'next/link'
import { ArrowLeft, BookOpen, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { InstructorPage, StatusBadge } from '@/components/InstructorPage'
import { getCourseBySlug } from '@/lib/course-data'

export default async function InstructorCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()
  const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0)
  return <InstructorPage title={course.title} description="Review your course structure, enrollment, and admin approval status." action={{ label: 'Edit course', href: `/instructor/courses/${slug}/edit` }}><Link href="/instructor/courses" className="inline-flex items-center gap-2 text-xs font-bold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Back to courses</Link><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl bg-white p-5 shadow-sm"><Users className="h-5 w-5 text-blue-500" /><strong className="mt-3 block text-xl text-[#1C1D52]">{course._count.enrollments}</strong><span className="text-xs text-slate-500">Enrolled students</span></div><div className="rounded-2xl bg-white p-5 shadow-sm"><BookOpen className="h-5 w-5 text-[#5FBB46]" /><strong className="mt-3 block text-xl text-[#1C1D52]">{lessonCount}</strong><span className="text-xs text-slate-500">Lessons</span></div><div className="rounded-2xl bg-white p-5 shadow-sm"><StatusBadge tone={course.status === 'PUBLISHED' ? 'green' : 'amber'}>{course.status}</StatusBadge><span className="mt-3 block text-xs text-slate-500">Admin approval status</span></div></div></InstructorPage>
}

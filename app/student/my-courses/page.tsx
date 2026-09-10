import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, CheckCircle2, ChevronDown } from 'lucide-react'

const courses = [
  { title: 'WordPress Development', instructor: 'Dr. Emmanuel', lessons: 12, total: 16, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=700&h=380&fit=crop&auto=format', action: 'Continue' },
  { title: 'Website Design with Figma', instructor: 'Alex Johnson', lessons: 4, total: 16, image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=700&h=380&fit=crop&auto=format', action: 'Continue' },
  { title: 'Introduction to Github', instructor: 'Sarah Connor', lessons: 8, total: 16, image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=700&h=380&fit=crop&auto=format', action: 'Continue' },
  { title: 'Full Stack Development', instructor: 'David Malon', lessons: 2, total: 20, image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=700&h=380&fit=crop&auto=format', action: 'Continue' },
  { title: 'Website Design with Webflow', instructor: 'Sophia Loren', lessons: 12, total: 20, image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=700&h=380&fit=crop&auto=format', action: 'Continue' },
  { title: 'UI/UX Fundamentals', instructor: 'Aster Seawalker', lessons: 0, total: 12, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&h=380&fit=crop&auto=format', action: 'Start Course' },
]

export default function MyCoursesPage() {
  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-6 text-white shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-7">
        <h1 className="text-3xl font-bold tracking-tight">My Course</h1>
        <p className="mt-2 text-sm text-white/85">Browse and purchase premium courses to expand your developer and design skills.</p>
      </section>

      <section>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1D52]">My Courses</h2>
            <p className="mt-1 text-sm text-slate-500">Manage and continue your academic learning paths.</p>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
            <span className="sr-only">Filter courses</span>
            <select className="h-10 appearance-none rounded-lg bg-white px-4 pr-9 text-sm shadow-[0_5px_18px_rgba(28,29,82,0.07)] outline-none focus:ring-2 focus:ring-[#5FBB46]/30" defaultValue="all">
              <option value="all">All Courses</option>
              <option value="progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="pointer-events-none -ml-8 h-4 w-4 text-slate-500" />
          </label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const progress = Math.round((course.lessons / course.total) * 100)
            const slug = course.title.toLowerCase().replaceAll(' ', '-')

            return (
              <article key={course.title} className="overflow-hidden rounded-xl bg-white p-2 shadow-[0_8px_24px_rgba(28,29,82,0.09)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(28,29,82,0.13)]">
                <div className="relative aspect-[2.1/1] overflow-hidden rounded-lg bg-slate-100">
                  <Image src={course.image} alt="" fill sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw" className="object-cover" />
                </div>
                <div className="px-2 pb-2 pt-3">
                  <Link href={`/student/my-courses/${slug}/preview`} className="block truncate text-sm font-bold text-[#1C1D52] hover:text-blue-600">{course.title}</Link>
                  <p className="mt-1 text-[11px] text-slate-500">Instructor: {course.instructor}</p>
                  <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{course.lessons} of {course.total} lessons completed</span>
                    <span className="font-bold text-[#1C1D52]">{progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E7EEF8]"><div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${progress}%` }} /></div>
                  <Link href={`/student/my-courses/${slug}/learn`} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#1C1D52] text-xs font-semibold text-white transition hover:bg-[#292b68]">
                    {course.lessons === course.total ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                    {course.action}
                  </Link>
                  <Link href={`/student/my-courses/${slug}/preview`} className="mt-2 block text-center text-[10px] font-semibold text-slate-500 hover:text-blue-600">View course preview</Link>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}

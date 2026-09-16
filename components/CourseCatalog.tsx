'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Course = {
  slug: string
  title: string
  instructor: string
  category: string | { name: string } | null
  level: 'Beginner' | 'Intermediate'
  duration: string
  lessons: number
  rating: number
  reviews: number
  price: number
  currency: string
  image?: string | null
  lessonCount: number
}

function categoryName(category: Course['category']): string | null {
  if (typeof category === 'string') return category
  if (category && typeof category === 'object' && 'name' in category) return category.name
  return null
}

export default function CourseCatalog() {
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All levels')

  // Keep the search box in sync if the URL's ?q= changes (e.g. a new
  // header search while already on this page).
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    fetch('/api/courses')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load courses.')
        return response.json() as Promise<Course[]>
      })
      .then(setCourses)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Unable to load courses.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const names = courses.map((course) => categoryName(course.category)).filter((c): c is string => Boolean(c))
    return ['All', ...new Set(names)]
  }, [courses])

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    return courses.filter((course) => {
      const courseCategoryName = categoryName(course.category)
      const matchesQuery = [course.title, course.instructor, courseCategoryName].join(' ').toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'All' || courseCategoryName === category
      const matchesLevel = level === 'All levels' || course.level === level
      return matchesQuery && matchesCategory && matchesLevel
    })
  }, [category, courses, level, query])

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4db848]">The catalogue</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your next skill</h2></div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses or instructors" aria-label="Search courses or instructors" className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-[#4db848] focus:ring-2 focus:ring-[#4db848]/15" />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-[#141650] text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-[#4db848] hover:text-[#141650]'}`}>{item}</button>)}</div>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-600"><SlidersHorizontal className="h-4 w-4" /><span className="sr-only">Filter by level</span><select value={level} onChange={(event) => setLevel(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-[#4db848]"><option>All levels</option><option>Beginner</option><option>Intermediate</option></select></label>
        </div>

        <p className="mt-8 text-sm text-slate-500">{loading ? 'Loading published courses...' : `Showing ${filteredCourses.length} of ${courses.length} courses`}</p>
        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">{error}</div> : filteredCourses.length > 0 ? <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredCourses.map((course) => { const courseCategoryName = categoryName(course.category); return <article key={course.slug} className="group overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[16/9] overflow-hidden bg-slate-100">{course.image ? <Image src={course.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full bg-[linear-gradient(135deg,#1c1d52,#5fbb46)]" />}<span className="absolute left-4 top-4 rounded-full bg-[#141650]/90 px-3 py-1 text-xs font-semibold text-white">{courseCategoryName ?? 'Course'}</span></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4db848]">{courseCategoryName ?? 'Academy'}</p><h3 className="mt-2 text-xl font-bold leading-snug">{course.title}</h3><p className="mt-2 text-sm text-slate-500">with {course.instructor || 'Grouh Academy'}</p><div className="mt-5 flex items-center gap-3 text-sm text-slate-500"><span className="font-semibold text-[#141650]">{course.rating ? `★ ${course.rating.toFixed(1)}` : 'New course'}</span><span>({course.reviews})</span><span className="ml-auto flex items-center gap-1"><BookOpen className="h-4 w-4" />{course.lessonCount} lessons</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-2xl font-black">{course.currency} {course.price}</span><Link href={`/student/my-courses/${course.slug}/preview`} className="inline-flex items-center gap-2 rounded-lg bg-[#5fbb46] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4aaa3e]">View course <ArrowRight className="h-4 w-4" /></Link></div></div></article> })}</div> : !loading && <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h3 className="text-lg font-bold">No published courses match those filters.</h3><p className="mt-2 text-sm text-slate-500">Try a different search term or reset one of the filters.</p></div>}
      </section>
      <section className="mx-auto mb-14 max-w-7xl px-6 lg:px-8"><div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#e8f4e4] px-6 py-8 sm:flex-row sm:items-center sm:px-10"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4db848]">Need a place to start?</p><h2 className="mt-2 text-2xl font-black">Build a learning path around your goal.</h2></div><a href="/about" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#141650] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#25275f]">How learning works <ArrowRight className="h-4 w-4" /></a></div></section>
    </>
  )
}
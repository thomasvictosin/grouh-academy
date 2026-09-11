'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Clock3, Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Course = {
  title: string
  instructor: string
  category: string
  level: 'Beginner' | 'Intermediate'
  duration: string
  lessons: number
  rating: number
  reviews: number
  price: number
  image: string
}

const courses: Course[] = [
  { title: 'Full-Stack Web Development', instructor: 'Emeka Okafor', category: 'Engineering', level: 'Beginner', duration: '14 weeks', lessons: 87, rating: 4.9, reviews: 312, price: 149, image: 'https://images.unsplash.com/photo-1617755870291-1f0de453ad30?w=900&h=560&fit=crop&auto=format' },
  { title: 'UI/UX Design Fundamentals', instructor: 'Adaeze Nwosu', category: 'Design', level: 'Beginner', duration: '8 weeks', lessons: 52, rating: 4.8, reviews: 278, price: 99, image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=900&h=560&fit=crop&auto=format' },
  { title: 'Data Science & Machine Learning', instructor: 'Chukwudi Eze', category: 'Data', level: 'Intermediate', duration: '16 weeks', lessons: 102, rating: 4.9, reviews: 445, price: 179, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop&auto=format' },
  { title: 'Digital Marketing & Growth', instructor: 'Ngozi Adeleke', category: 'Marketing', level: 'Beginner', duration: '6 weeks', lessons: 41, rating: 4.7, reviews: 198, price: 79, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=560&fit=crop&auto=format' },
  { title: 'Cloud Infrastructure & DevOps', instructor: 'Tunde Fashola', category: 'Engineering', level: 'Intermediate', duration: '10 weeks', lessons: 64, rating: 4.8, reviews: 164, price: 129, image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=900&h=560&fit=crop&auto=format' },
  { title: 'Product Management Essentials', instructor: 'Ifeoma Chukwu', category: 'Product', level: 'Intermediate', duration: '7 weeks', lessons: 48, rating: 4.7, reviews: 221, price: 109, image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900&h=560&fit=crop&auto=format' },
]

const categories = ['All', 'Engineering', 'Design', 'Data', 'Marketing', 'Product']

export default function CourseCatalog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All levels')

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    return courses.filter((course) => {
      const matchesQuery = [course.title, course.instructor, course.category].join(' ').toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'All' || course.category === category
      const matchesLevel = level === 'All levels' || course.level === level
      return matchesQuery && matchesCategory && matchesLevel
    })
  }, [category, level, query])

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

        <p className="mt-8 text-sm text-slate-500">Showing {filteredCourses.length} of {courses.length} courses</p>
        {filteredCourses.length > 0 ? <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filteredCourses.map((course) => { const slug = course.title.toLowerCase().replaceAll(' ', '-'); return <article key={course.title} className="group overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[16/9] overflow-hidden bg-slate-100"><Image src={course.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#141650]/90 px-3 py-1 text-xs font-semibold text-white">{course.level}</span></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#4db848]">{course.category}</p><h3 className="mt-2 text-xl font-bold leading-snug">{course.title}</h3><p className="mt-2 text-sm text-slate-500">with {course.instructor}</p><div className="mt-5 flex items-center gap-3 text-sm text-slate-500"><span className="font-semibold text-[#141650]">★ {course.rating}</span><span>({course.reviews})</span><span className="ml-auto flex items-center gap-1"><Clock3 className="h-4 w-4" />{course.duration}</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-2xl font-black">${course.price}</span><Link href={`/student/my-courses/${slug}/preview`} className="inline-flex items-center gap-2 rounded-lg bg-[#5fbb46] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#4aaa3e]">View course <ArrowRight className="h-4 w-4" /></Link></div></div></article> })}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h3 className="text-lg font-bold">No courses match those filters.</h3><p className="mt-2 text-sm text-slate-500">Try a different search term or reset one of the filters.</p></div>}
      </section>
      <section className="mx-auto mb-14 max-w-7xl px-6 lg:px-8"><div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#e8f4e4] px-6 py-8 sm:flex-row sm:items-center sm:px-10"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#4db848]">Need a place to start?</p><h2 className="mt-2 text-2xl font-black">Build a learning path around your goal.</h2></div><a href="/about" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#141650] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#25275f]">How learning works <ArrowRight className="h-4 w-4" /></a></div></section>
    </>
  )
}

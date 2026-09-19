'use client'

import { useEffect, useMemo, useState } from 'react'

type CourseCategory = { name?: string | null } | string | null

type DbCourse = {
  id: string
  slug: string
  title: string
  description?: string | null
  thumbnail?: string | null
  price: number
  currency: string
  category: CourseCategory
  creator?: { name?: string | null } | null
  instructors?: Array<{ instructor?: { name?: string | null } | null }> | null
  rating?: number | null
  lessonCount?: number
  reviews?: Array<{ rating: number }>
  _count?: { reviews?: number; modules?: number }
  modules?: Array<unknown>
}

function categoryName(category: CourseCategory) {
  if (typeof category === 'string') return category
  if (category && typeof category === 'object' && 'name' in category) return category.name
  return 'General'
}

function getInstructorName(course: DbCourse) {
  const firstInstructor = course.instructors?.[0]?.instructor?.name
  return firstInstructor || course.creator?.name || 'Grouh Academy'
}

function formatPrice(course: DbCourse) {
  return `${course.currency || 'NGN'} ${course.price}`
}

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<DbCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/courses')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load courses.')
        return response.json() as Promise<DbCourse[]>
      })
      .then((responseCourses) => setCourses(responseCourses.slice(0, 6)))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo<string[]>(() => {
    const names = courses
      .map((course) => categoryName(course.category))
      .filter((name): name is string => Boolean(name))

    return ['All', ...new Set(names)]
  }, [courses])

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return courses
    return courses.filter((course) => categoryName(course.category) === activeCategory)
  }, [activeCategory, courses])

  return (
    <section id="courses" className="py-24 lg:py-32" style={{ backgroundColor: '#f8f9fe' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2">
              <div className="h-px w-8" style={{ backgroundColor: '#4db848' }} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>
                Curriculum
              </span>
            </div>
            <h2
              className="text-4xl font-black leading-tight lg:text-5xl"
              style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}
            >
              Courses that move
              <br />
              your career forward.
            </h2>
          </div>

          <a
            href="/courses"
            className="inline-flex items-center gap-2 self-start text-sm font-semibold transition-all hover:gap-3 lg:self-auto"
            style={{ color: '#4db848' }}
          >
            View all courses
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {!loading && categories.length > 1 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-500 hover:border-green-300'
                }`}
                style={activeCategory === cat ? { backgroundColor: '#141650' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Loading published courses...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            No published courses are available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => {
              const reviewCount = course._count?.reviews ?? course.reviews?.length ?? 0
              const averageRating = typeof course.rating === 'number' && Number.isFinite(course.rating) ? course.rating : 0
              const lessonCount = course.lessonCount ?? 0
              const category = categoryName(course.category)
              const image = course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=900&fit=crop&auto=format'

              return (
                <div
                  key={course.id}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: '#e8e9f8' }}>
                    <img
                      src={image}
                      alt={course.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-[#141650]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      {category}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: '#4db848' }}>
                      {category}
                    </div>

                    <h3 className="mb-3 text-base font-bold leading-snug" style={{ color: '#141650' }}>
                      {course.title}
                    </h3>

                    <p className="mb-3 text-sm text-gray-500">with {getInstructorName(course)}</p>

                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <svg key={index} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={index < Math.round(averageRating) ? 'opacity-100' : 'opacity-30'}>
                            <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.336 24 12 19.897 4.664 24l1.636-8.694L.6 9.75l7.732-1.732L12 .587z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: '#141650' }}>
                        {averageRating > 0 ? averageRating.toFixed(1) : 'New'}
                      </span>
                      <span className="text-xs text-gray-400">({reviewCount})</span>
                    </div>

                    <div className="mb-5 flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" strokeLinecap="round" />
                        </svg>
                        {course.modules?.length ? `${course.modules.length} modules` : 'Self-paced'}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" strokeLinecap="round" />
                          <rect x="1" y="5" width="14" height="14" rx="2" />
                        </svg>
                        {lessonCount} lessons
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-2xl font-black" style={{ color: '#141650', fontFamily: 'Fraunces, serif' }}>
                        {formatPrice(course)}
                      </span>
                      <a
                        href={`/student/my-courses/${course.slug}/preview`}
                        className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: '#4db848' }}
                      >
                        Enroll Now
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedCourses

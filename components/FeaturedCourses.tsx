'use client'


import React, { useState } from 'react'

type StarRatingProps = { rating: number }

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const half = rating - fullStars >= 0.5
  const stars = [] as React.ReactNode[]
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
        <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.336 24 12 19.897 4.664 24l1.636-8.694L.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    )
  }
  if (half) {
    stars.push(
      <svg key="half" width="14" height="14" viewBox="0 0 24 24" className="text-yellow-400">
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#halfGrad)" d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L19.336 24 12 19.897 4.664 24l1.636-8.694L.6 9.75l7.732-1.732L12 .587z" />
      </svg>
    )
  }
  return <div className="flex items-center gap-1">{stars}</div>
}

type LevelBadgeProps = { level: string }

const LevelBadge: React.FC<LevelBadgeProps> = ({ level }) => (
  <div className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: 'rgba(20,22,80,0.9)', color: '#fff' }}>
    {level}
  </div>
)

const FeaturedCourses = () => {
    const COURSES = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    instructor: 'Emeka Okafor',
    rating: 4.9,
    reviews: 312,
    duration: '14 weeks',
    lessons: 87,
    level: 'Beginner',
    price: 149,
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1617755870291-1f0de453ad30?w=600&h=380&fit=crop&auto=format',
  },
  {
    id: 2,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Adaeze Nwosu',
    rating: 4.8,
    reviews: 278,
    duration: '8 weeks',
    lessons: 52,
    level: 'Beginner',
    price: 99,
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600&h=380&fit=crop&auto=format',
  },
  {
    id: 3,
    title: 'Data Science & Machine Learning',
    instructor: 'Chukwudi Eze',
    rating: 4.9,
    reviews: 445,
    duration: '16 weeks',
    lessons: 102,
    level: 'Intermediate',
    price: 179,
    category: 'Data',
    image: 'https://images.unsplash.com/photo-1753613648191-4771cf76f034?w=600&h=380&fit=crop&auto=format',
  },
  {
    id: 4,
    title: 'Digital Marketing & Growth',
    instructor: 'Ngozi Adeleke',
    rating: 4.7,
    reviews: 198,
    duration: '6 weeks',
    lessons: 41,
    level: 'Beginner',
    price: 79,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=380&fit=crop&auto=format',
  },
  {
    id: 5,
    title: 'Cloud Infrastructure & DevOps',
    instructor: 'Tunde Fashola',
    rating: 4.8,
    reviews: 164,
    duration: '10 weeks',
    lessons: 64,
    level: 'Intermediate',
    price: 129,
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=380&fit=crop&auto=format',
  },
  {
    id: 6,
    title: 'Product Management Essentials',
    instructor: 'Ifeoma Chukwu',
    rating: 4.7,
    reviews: 221,
    duration: '7 weeks',
    lessons: 48,
    level: 'Intermediate',
    price: 109,
    category: 'Product',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=380&fit=crop&auto=format',
  },
]

const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', 'Engineering', 'Design', 'Data', 'Marketing', 'Product']

  const filtered = activeCategory === 'All'
    ? COURSES
    : COURSES.filter((c) => c.category === activeCategory)


  return (
    <section id="courses" className="py-24 lg:py-32" style={{ backgroundColor: '#f8f9fe' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: '#4db848' }} />
              <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#4db848' }}>Curriculum</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-black leading-tight"
              style={{ fontFamily: 'Fraunces, serif', color: '#141650' }}
            >
              Courses that move
              <br />your career forward.
            </h2>
          </div>
          <a
            href="#"
            className="self-start lg:self-auto inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
            style={{ color: '#4db848' }}
          >
            View all courses
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300'
              }`}
              style={activeCategory === cat ? { backgroundColor: '#141650' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', backgroundColor: '#e8e9f8' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <LevelBadge level={course.level} />
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: '#4db848' }}>
                  {course.category}
                </div>
                <h3 className="font-bold text-base leading-snug mb-3" style={{ color: '#141650' }}>
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{course.instructor}</p>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={course.rating} />
                  <span className="font-semibold text-sm" style={{ color: '#141650' }}>{course.rating}</span>
                  <span className="text-gray-400 text-xs">({course.reviews})</span>
                </div>

                <div className="flex items-center gap-4 text-gray-400 text-xs mb-5">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/>
                    </svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" strokeLinecap="round"/>
                      <rect x="1" y="5" width="14" height="14" rx="2"/>
                    </svg>
                    {course.lessons} lessons
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-2xl font-black" style={{ color: '#141650', fontFamily: 'Fraunces, serif' }}>
                    ${course.price}
                  </span>
                  <button
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#4db848' }}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses

import React from 'react'
import { BookOpen, Zap, TrendingUp, Clock, Smartphone, Palette, Laptop, Sparkles, Video } from 'lucide-react'

interface StatCard {
  icon: React.ReactNode
  label: string
  value: string
}

interface Course {
  id: string
  title: string
  instructor: string
  lessons: number
  total: number
  thumbnail?: React.ReactNode
  color?: string
}

interface RecommendedCourse {
  id: string
  title: string
  description: string
  thumbnail?: string
}

const sampleCourses: Course[] = [
  { 
    id: '1', 
    title: 'WordPress Development', 
    instructor: 'Academy', 
    lessons: 12, 
    total: 16,
    color: 'bg-purple-100',
    thumbnail: <Smartphone className="h-8 w-8" />
  },
  { 
    id: '2', 
    title: 'Website Design with Figma', 
    instructor: 'Design Team', 
    lessons: 12, 
    total: 16,
    color: 'bg-pink-100',
    thumbnail: <Palette className="h-8 w-8" />
  },
  { 
    id: '3', 
    title: 'Introduction to Github', 
    instructor: 'Dev Team', 
    lessons: 12, 
    total: 16,
    color: 'bg-blue-100',
    thumbnail: <Laptop className="h-8 w-8" />
  },
  { 
    id: '4', 
    title: 'Website Design with Webflow', 
    instructor: 'Design Team', 
    lessons: 12, 
    total: 16,
    color: 'bg-indigo-100',
    thumbnail: <Sparkles className="h-8 w-8" />
  },
]

const recommendedCourses: RecommendedCourse[] = [
  {
    id: '1',
    title: 'Full Stack Development',
    description: 'Laravel is a PHP based web framework for building high-end',
  },
  {
    id: '2',
    title: 'Full Stack Development',
    description: 'Laravel is a PHP based web framework for building high-end',
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Laravel is a PHP based web framework for building high-end',
  },
]

const stats: StatCard[] = [
  { icon: <BookOpen className="h-6 w-6" />, label: 'Enrolled Courses', value: '6' },
  { icon: <Zap className="h-6 w-6" />, label: 'Completed Courses', value: '2' },
  { icon: <TrendingUp className="h-6 w-6" />, label: 'Overall Progress', value: '10%' },
  { icon: <Clock className="h-6 w-6" />, label: 'Time Spent', value: '18h 45m' },
]

export default function StudentDashboardPage() {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-[#5FBB46] p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Emmanuel</h1>
        <p className="text-white/90">Laravel is a PHP based web framework for building high-end</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.06)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
              <div className="text-gray-400">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Progress Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Learning Progress</h2>
          <a href="#" className="text-blue-600 text-sm font-medium hover:underline">View all courses</a>
        </div>

        <div className="space-y-4">
          {sampleCourses.map((course) => {
            const progressPercent = Math.round((course.lessons / course.total) * 100)
            return (
              <div key={course.id} className="rounded-lg bg-white p-6 shadow-[0_8px_24px_rgba(28,29,82,0.06)] transition-shadow hover:shadow-md">
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className={`${course.color} rounded-lg w-20 h-20 flex items-center justify-center flex-shrink-0 text-3xl`}>
                    {course.thumbnail}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{course.lessons} of {course.total} lessons completed</p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#5FBB46] transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Percentage */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-gray-900">{progressPercent}%</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommended Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended Courses</h2>
          <a href="#" className="text-blue-600 text-sm font-medium hover:underline">See More</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <div key={course.id} className="overflow-hidden rounded-lg bg-white shadow-[0_8px_24px_rgba(28,29,82,0.06)] transition-shadow hover:shadow-lg">
              {/* Course Thumbnail */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-40 flex items-center justify-center text-4xl">
                <Video className="h-10 w-10" />
              </div>

              {/* Course Info */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-6">{course.description}</p>
                <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

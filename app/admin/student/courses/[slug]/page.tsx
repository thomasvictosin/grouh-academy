import { ArrowLeft, BookOpen, CalendarDays, Clock3, DollarSign, FileText, GraduationCap, Star, Users } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

const courseCatalog: Record<string, {
  name: string
  category: string
  instructor: string
  duration: string
  level: string
  price: string
  status: 'Published' | 'Draft' | 'Pending' | 'Rejected' | 'Archived'
  students: number
  rating: number
  revenue: string
  created: string
  description: string
  overview: string[]
  modules: { title: string; lessons: string; duration: string }[]
}> = {
  'web-development': {
    name: 'Web Development',
    category: 'Web Development',
    instructor: 'Sarah Johnson',
    duration: '8 weeks',
    level: 'Intermediate',
    price: '$149',
    status: 'Published',
    students: 450,
    rating: 4.8,
    revenue: '$134,550',
    created: '2025-10-12',
    description: 'Build responsive, scalable products with HTML, CSS, JavaScript, and modern frontend architecture.',
    overview: ['Frontend and backend fundamentals', 'Modern JavaScript and component-driven UI', 'Deployment, testing, and user experience workflows'],
    modules: [
      { title: 'HTML & CSS Foundations', lessons: '6 lessons', duration: '2h 15m' },
      { title: 'JavaScript Essentials', lessons: '10 lessons', duration: '4h 30m' },
      { title: 'React & State Management', lessons: '8 lessons', duration: '5h 10m' },
      { title: 'Backend Integration', lessons: '7 lessons', duration: '3h 45m' },
    ],
  },
  'data-science': {
    name: 'Data Science',
    category: 'Data Science',
    instructor: 'David Miller',
    duration: '10 weeks',
    level: 'Advanced',
    price: '$179',
    status: 'Published',
    students: 380,
    rating: 4.5,
    revenue: '$113,620',
    created: '2025-09-01',
    description: 'Learn how to clean, analyze, and interpret data through practical Python and statistical workflows.',
    overview: ['Exploratory data analysis', 'Statistical modeling and inferencing', 'Visualization and decision-ready reporting'],
    modules: [
      { title: 'Python for Data Work', lessons: '9 lessons', duration: '4h 00m' },
      { title: 'Statistics & Probability', lessons: '8 lessons', duration: '3h 50m' },
      { title: 'Data Visualization', lessons: '7 lessons', duration: '3h 15m' },
      { title: 'Predictive Modeling', lessons: '6 lessons', duration: '4h 05m' },
    ],
  },
  'ui-ux-design': {
    name: 'UI/UX Design',
    category: 'Design',
    instructor: 'Jessie Cooper',
    duration: '6 weeks',
    level: 'Beginner',
    price: '$129',
    status: 'Published',
    students: 310,
    rating: 4.9,
    revenue: '$92,690',
    created: '2025-08-15',
    description: 'Create user-centered experiences with prototypes, design systems, accessibility, and conversion-focused thinking.',
    overview: ['Research and user interviews', 'Wireframes and interaction design', 'Product validation and design handoff'],
    modules: [
      { title: 'Design Research', lessons: '5 lessons', duration: '2h 40m' },
      { title: 'UI Systems', lessons: '8 lessons', duration: '4h 00m' },
      { title: 'Usability Testing', lessons: '6 lessons', duration: '2h 35m' },
      { title: 'Portfolio Case Study', lessons: '4 lessons', duration: '2h 20m' },
    ],
  },
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = courseCatalog[slug] ?? courseCatalog['web-development']

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <Link href="/admin/student/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <section className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-[#e8faf7] px-2.5 py-1 text-[9px] font-semibold text-teal-600">
                {course.status}
              </div>
              <h1 className="text-2xl font-bold text-[#1C1D52] sm:text-3xl">{course.name}</h1>
              <p className="mt-2 text-sm text-slate-500">{course.category} · Taught by {course.instructor}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/student/courses/${slug}/edit`} className="rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">Edit Course</Link>
              <Link href={`/admin/student/courses/${slug}/archive`} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Archive Course</Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4" />} value={String(course.students)} label="Students" />
          <StatCard icon={<Star className="h-4 w-4" />} value={`${course.rating.toFixed(1)}`} label="Average Rating" />
          <StatCard icon={<DollarSign className="h-4 w-4" />} value={course.revenue} label="Revenue" />
          <StatCard icon={<CalendarDays className="h-4 w-4" />} value={course.created} label="Created" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Course Overview</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">{course.description}</p>

            <ul className="mt-5 space-y-3 text-[11px] text-slate-600">
              {course.overview.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#5FBB46]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="border-b border-slate-200 pb-3 text-sm font-bold text-[#1C1D52]">Course Details</h2>
            <dl className="mt-4 space-y-4 text-[10px] text-slate-600">
              <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="Instructor" value={course.instructor} />
              <InfoRow icon={<BookOpen className="h-3.5 w-3.5" />} label="Category" value={course.category} />
              <InfoRow icon={<Clock3 className="h-3.5 w-3.5" />} label="Duration" value={course.duration} />
              <InfoRow icon={<FileText className="h-3.5 w-3.5" />} label="Level" value={course.level} />
              <InfoRow icon={<DollarSign className="h-3.5 w-3.5" />} label="Price" value={course.price} />
            </dl>
          </section>
        </div>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <h2 className="text-sm font-bold text-[#1C1D52]">Curriculum Snapshot</h2>
          <div className="mt-5 space-y-3">
            {course.modules.map((module) => (
              <div key={module.title} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-[#1C1D52]">{module.title}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{module.lessons}</p>
                </div>
                <span className="text-[10px] font-medium text-slate-500">{module.duration}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dceeff] text-blue-500">{icon}</span>
      <strong className="mt-4 block text-xl text-[#1C1D52]">{value}</strong>
      <span className="mt-1 block text-[10px] text-slate-500">{label}</span>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[#f8fbff] px-3 py-2.5">
      <dt className="flex items-center gap-2 font-semibold text-[#1C1D52]">{icon}{label}</dt>
      <dd className="text-slate-500">{value}</dd>
    </div>
  )
}

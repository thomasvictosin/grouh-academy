import { ArrowLeft, BookOpen, CheckCircle2, Clock3, Play, Users } from 'lucide-react'
import Link from 'next/link'

const courseData = {
  title: 'WordPress Development',
  instructor: 'Dr. Emmanuel',
  category: 'Development',
  level: 'Intermediate',
  duration: '8 weeks',
  progress: 75,
  completedLessons: 12,
  totalLessons: 16,
  description: 'Build practical WordPress websites from structure to launch, with a clear workflow for themes, content, plugins, and client-ready delivery.',
  modules: [
    { title: 'WordPress Foundations', summary: 'Understand the WordPress ecosystem and set up a reliable project foundation.', lessons: ['WordPress as a CMS', 'Setting up your development environment', 'Pages, posts, and content structure'], duration: '1h 40m', complete: true },
    { title: 'Building with Themes', summary: 'Create a flexible visual system and shape the front end of a WordPress site.', lessons: ['Theme anatomy', 'Templates and page layouts', 'Responsive styling'], duration: '2h 15m', complete: true },
    { title: 'Plugins and Site Features', summary: 'Extend your site with carefully chosen plugins and maintain a healthy setup.', lessons: ['Choosing the right plugins', 'Forms and content workflows', 'Security and performance basics'], duration: '2h 30m', complete: false },
    { title: 'Launch and Handoff', summary: 'Prepare a polished site for launch and hand it over with confidence.', lessons: ['Pre-launch checklist', 'Deployment and backups', 'Client handoff'], duration: '1h 45m', complete: false },
  ],
}

export default async function CoursePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div className="w-full max-w-full space-y-5 overflow-x-hidden">
      <Link href="/student/my-courses" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to My Courses
      </Link>

      <section className="overflow-hidden rounded-2xl bg-[#1C1D52] text-white shadow-[0_12px_28px_rgba(28,29,82,0.16)]">
        <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-10 lg:py-9">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9be28a]">Enrolled course preview</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{courseData.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">{courseData.description}</p>
            <p className="mt-4 text-xs text-white/60">{courseData.category} · {courseData.level} · Taught by {courseData.instructor}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/student/my-courses/${slug}/learn`} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">
                <Play className="h-4 w-4" />
                Continue learning
              </Link>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/80">
                <CheckCircle2 className="h-4 w-4 text-[#9be28a]" />
                {courseData.progress}% complete
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/10 p-5">
            <p className="text-xs font-semibold text-white/80">Your progress</p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="text-3xl font-bold">{courseData.progress}%</span>
              <span className="text-[10px] text-white/60">{courseData.completedLessons} of {courseData.totalLessons} lessons</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#5FBB46]" style={{ width: `${courseData.progress}%` }} /></div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-[10px] text-white/65">
              <span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> {courseData.duration}</span>
              <span className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> 4 modules</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Course roadmap</p>
            <h2 className="mt-1 text-xl font-bold text-[#1C1D52]">What you will learn</h2>
          </div>
          <p className="text-xs text-slate-500">{courseData.totalLessons} lessons across {courseData.modules.length} modules</p>
        </div>

        <div className="mt-5 space-y-3">
          {courseData.modules.map((module, index) => (
            <details key={module.title} open={index === 2} className="group rounded-xl border border-slate-200 bg-[#f8fbff]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${module.complete ? 'bg-[#e8faf7] text-teal-600' : 'bg-[#dceeff] text-blue-600'}`}>{module.complete ? <CheckCircle2 className="h-4 w-4" /> : `0${index + 1}`}</span>
                  <div className="min-w-0"><h3 className="truncate text-sm font-bold text-[#1C1D52]">{module.title}</h3><p className="mt-1 text-[10px] text-slate-500">{module.summary}</p></div>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-slate-500">{module.lessons.length} lessons · {module.duration}</span>
              </summary>
              <div className="border-t border-slate-200 px-4 pb-4 pt-3 sm:pl-16">
                <div className="space-y-2">{module.lessons.map((lesson, lessonIndex) => <Link key={lesson} href={`/student/my-courses/${slug}/learn?module=${index}&lesson=${lessonIndex}`} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2.5 text-xs text-slate-600 hover:text-blue-600"><Play className="h-3.5 w-3.5 text-[#5FBB46]" />{lesson}</Link>)}</div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]"><Users className="h-5 w-5 text-[#5FBB46]" /><h2 className="mt-3 text-sm font-bold text-[#1C1D52]">Learn at your pace</h2><p className="mt-2 text-xs leading-5 text-slate-500">Return to any completed lesson, or continue from your saved progress whenever you are ready.</p></section>
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]"><BookOpen className="h-5 w-5 text-blue-500" /><h2 className="mt-3 text-sm font-bold text-[#1C1D52]">Materials included</h2><p className="mt-2 text-xs leading-5 text-slate-500">Lessons include practical explanations, video guidance, and downloadable resources where provided.</p></section>
      </div>
    </div>
  )
}
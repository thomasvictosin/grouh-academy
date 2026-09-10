import { BookOpen, Sparkles, Users } from 'lucide-react'
import Breadcrumbs from '@/components/Breadcrumbs'
import CourseCatalog from '@/components/CourseCatalog'

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#141650]">
      <section className="border-b border-[#25275f]/10 bg-[#141650] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <Breadcrumbs current="Courses" dark />
          <div className="max-w-3xl">
            <div className="mb-5 mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#8edb70]"><Sparkles className="h-4 w-4" />Build what is next</div>
            <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Practical courses for a changing world.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">Learn from working professionals, practise with real projects, and build the confidence to make your next move.</p>
          </div>
          <div className="mt-10 grid max-w-4xl gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-[#8edb70]" /><span><strong className="block text-xl">30+</strong><small className="text-white/60">career-ready courses</small></span></div>
            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-[#f0be43]" /><span><strong className="block text-xl">5,000+</strong><small className="text-white/60">active learners</small></span></div>
            <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[#8edb70]" /><span><strong className="block text-xl">4.9 / 5</strong><small className="text-white/60">average course rating</small></span></div>
          </div>
        </div>
      </section>
      <CourseCatalog />
    </main>
  )
}

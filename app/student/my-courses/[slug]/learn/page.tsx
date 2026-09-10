'use client'

import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, Download, FileText, Maximize2, Menu, Play, RotateCcw, RotateCw, Video, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

type Lesson = { title: string; videoUrl: string; content: string; resources: string[]; complete: boolean }
type Module = { title: string; summary: string; lessons: Lesson[]; videoUrl: string; content: string; resources: string[] }

const modules: Module[] = [
  {
    title: 'WordPress Foundations',
    summary: 'Understand the WordPress ecosystem and set up a reliable project foundation.',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    content: '',
    resources: [],
    lessons: [
      { title: 'WordPress as a CMS', videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', content: 'WordPress gives you a flexible content system for creating and managing pages, posts, media, and reusable site structures. In this lesson, we will map the main parts of the dashboard and understand how they work together.', resources: ['WordPress glossary', 'Course setup checklist'], complete: true },
      { title: 'Setting up your development environment', videoUrl: '', content: 'Prepare a clean local environment, create a new site, and confirm that your theme and plugins can be developed safely.', resources: ['Development environment guide'], complete: true },
      { title: 'Pages, posts, and content structure', videoUrl: '', content: 'Choose the right content type for each piece of information so the site remains easy to manage as it grows.', resources: ['Content planning worksheet'], complete: true },
    ],
  },
  {
    title: 'Building with Themes',
    summary: 'Create a flexible visual system and shape the front end of a WordPress site.',
    videoUrl: '',
    content: 'This module is a complete workshop. Use the reference material below while you build a responsive theme structure from the supplied brief.',
    resources: ['Theme anatomy reference', 'Responsive layout exercise'],
    lessons: [],
  },
  {
    title: 'Plugins and Site Features',
    summary: 'Extend your site with carefully chosen plugins and maintain a healthy setup.',
    videoUrl: '',
    content: '',
    resources: [],
    lessons: [
      { title: 'Choosing the right plugins', videoUrl: '', content: 'Evaluate plugins by maintenance history, compatibility, performance, and whether they solve a real product need.', resources: ['Plugin evaluation checklist'], complete: false },
      { title: 'Forms and content workflows', videoUrl: '', content: 'Design a simple workflow that lets your team collect, review, and publish content consistently.', resources: ['Workflow template'], complete: false },
    ],
  },
]

export default function CourseLearningPage() {
  const [selectedModule, setSelectedModule] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [playingMedia, setPlayingMedia] = useState('')
  const [isPaused, setIsPaused] = useState(false)
  const playerRef = useRef<HTMLIFrameElement>(null)
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const currentTimeRef = useRef(0)
  const module = modules[selectedModule]
  const lesson = module.lessons[selectedLesson]
  const hasLessons = module.lessons.length > 0
  const title = hasLessons ? lesson.title : module.title
  const mediaUrl = hasLessons ? lesson.videoUrl : module.videoUrl
  const mediaKey = `${selectedModule}-${selectedLesson}`

  useEffect(() => {
    if (playingMedia !== mediaKey) return

    const handlePlayerMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.event === 'infoDelivery' && typeof data.info?.currentTime === 'number') currentTimeRef.current = data.info.currentTime
      } catch {
        // Ignore unrelated postMessage events.
      }
    }

    window.addEventListener('message', handlePlayerMessage)
    const syncTime = window.setInterval(() => {
      playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }), '*')
    }, 500)

    return () => {
      window.removeEventListener('message', handlePlayerMessage)
      window.clearInterval(syncTime)
    }
  }, [mediaKey, playingMedia])

  const selectModule = (moduleIndex: number) => {
    setSelectedModule(moduleIndex)
    setSelectedLesson(0)
    setCompleted(false)
    setPlayingMedia('')
    setIsPaused(false)
    setSidebarOpen(false)
  }

  const selectLesson = (lessonIndex: number) => {
    setSelectedLesson(lessonIndex)
    setCompleted(false)
    setPlayingMedia('')
    setIsPaused(false)
    setSidebarOpen(false)
  }

  const goNext = () => {
    if (hasLessons && selectedLesson < module.lessons.length - 1) {
      selectLesson(selectedLesson + 1)
      return
    }
    if (selectedModule < modules.length - 1) selectModule(selectedModule + 1)
  }

  const sendPlayerCommand = (func: string, args: unknown[] = []) => {
    playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  }

  const seekBy = (seconds: number) => {
    sendPlayerCommand('seekTo', [Math.max(0, currentTimeRef.current + seconds), true])
  }

  const toggleFullscreen = async () => {
    if (!mediaContainerRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await mediaContainerRef.current.requestFullscreen()
    }
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] w-full max-w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3"><Link href="/student/my-courses" className="shrink-0 text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-5 w-5" /></Link><div className="min-w-0"><p className="truncate text-sm font-bold text-[#1C1D52]">WordPress Development</p><p className="text-[10px] text-slate-500">Course player · Module {selectedModule + 1} of {modules.length}</p></div></div>
        <div className="flex items-center gap-3"><span className="hidden text-[10px] font-semibold text-slate-500 sm:inline">75% complete</span><button type="button" onClick={() => setSidebarOpen((value) => !value)} className="rounded-lg border border-slate-200 p-2 text-[#1C1D52] lg:hidden" aria-label="Toggle course outline">{sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button></div>
      </header>

      <div className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} border-b border-slate-200 bg-[#f8fbff] lg:block lg:border-b-0 lg:border-r`}>
          <div className="border-b border-slate-200 p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Course outline</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-3/4 rounded-full bg-[#5FBB46]" /></div><p className="mt-2 text-[10px] text-slate-500">12 of 16 lessons complete</p></div>
          <div className="space-y-2 p-3">
            {modules.map((item, moduleIndex) => (
              <div key={item.title} className="rounded-lg">
                <button type="button" onClick={() => selectModule(moduleIndex)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left ${selectedModule === moduleIndex ? 'bg-[#1C1D52] text-white' : 'text-[#1C1D52] hover:bg-white'}`}><span className="text-[10px] font-bold">0{moduleIndex + 1}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.title}</span><ChevronDown className="h-3.5 w-3.5" /></button>
                {selectedModule === moduleIndex && <div className="mt-1 space-y-1 pl-3">{item.lessons.length > 0 ? item.lessons.map((itemLesson, lessonIndex) => <button type="button" key={itemLesson.title} onClick={() => selectLesson(lessonIndex)} className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] ${selectedLesson === lessonIndex ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-500 hover:bg-white'}`}><span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white">{itemLesson.complete ? <Check className="h-3 w-3 text-[#5FBB46]" /> : <Play className="h-2.5 w-2.5" />}</span><span className="truncate">{itemLesson.title}</span></button>) : <div className="px-2.5 py-2 text-[10px] italic text-slate-400">Direct module content</div>}</div>}
              </div>
            ))}
          </div>
        </aside>

        <main className="min-w-0 bg-white">
          <div className="mx-auto max-w-[850px] px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500"><span>Module {selectedModule + 1}</span><span>·</span><span>{hasLessons ? `Lesson ${selectedLesson + 1} of ${module.lessons.length}` : 'Module content'}</span></div>
            <h1 className="mt-3 text-2xl font-bold text-[#1C1D52] sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{module.summary}</p>

            {mediaUrl ? (
              <div ref={mediaContainerRef} className="mt-6 aspect-video overflow-hidden rounded-xl bg-[#101426] shadow-[0_12px_30px_rgba(28,29,82,0.16)]">
                {playingMedia === mediaKey ? (
                  <div className="relative h-full w-full">
                    <iframe ref={playerRef} className="h-full w-full" src={`${mediaUrl}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0&disablekb=1&playsinline=1&enablejsapi=1`} title={`${title} lesson media`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                    <div className="absolute inset-0 z-10" aria-hidden="true" />
                    <div className="pointer-events-none absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-3 text-white"><span className="text-[10px] font-semibold uppercase tracking-[0.12em]">Lesson media</span><span className="text-[10px] text-white/70">Now playing</span></div>
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => seekBy(-10)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1C1D52] shadow-lg transition hover:bg-white" aria-label="Rewind 10 seconds"><RotateCcw className="h-4 w-4" /></button>
                        <button
                          type="button"
                          onClick={() => {
                            sendPlayerCommand(isPaused ? 'playVideo' : 'pauseVideo')
                            setIsPaused((value) => !value)
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1C1D52] shadow-lg transition hover:bg-white"
                          aria-label={isPaused ? 'Resume video' : 'Pause video'}
                        >
                          {isPaused ? <Play className="ml-0.5 h-4 w-4 fill-current" /> : <span className="flex gap-1"><span className="h-4 w-1 rounded-full bg-current" /><span className="h-4 w-1 rounded-full bg-current" /></span>}
                        </button>
                        <button type="button" onClick={() => seekBy(10)} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1C1D52] shadow-lg transition hover:bg-white" aria-label="Forward 10 seconds"><RotateCw className="h-4 w-4" /></button>
                      </div>
                      <button type="button" onClick={toggleFullscreen} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#1C1D52] shadow-lg transition hover:bg-white" aria-label="Toggle fullscreen"><Maximize2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setPlayingMedia(mediaKey); setIsPaused(false) }} className="group relative flex h-full w-full items-center justify-center overflow-hidden text-left">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(95,187,70,0.38),transparent_32%),linear-gradient(135deg,#121936,#253b66)]" />
                    <div className="relative z-10 flex flex-col items-center text-center text-white"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#5FBB46] text-[#14204f] shadow-[0_8px_24px_rgba(95,187,70,0.32)] transition group-hover:scale-105"><Play className="ml-1 h-7 w-7 fill-current" /></span><span className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">Lesson media</span><span className="mt-1 text-sm font-semibold">Start {hasLessons ? 'lesson' : 'module'} video</span></div>
                    <span className="absolute bottom-4 left-4 z-10 rounded-md bg-black/25 px-2.5 py-1.5 text-[10px] text-white/75">Course content</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-6 flex aspect-video items-center justify-center rounded-xl border border-dashed border-slate-300 bg-[#f8fbff]"><div className="text-center"><Video className="mx-auto h-7 w-7 text-blue-500" /><p className="mt-3 text-xs font-semibold text-[#1C1D52]">No video added for this content</p><p className="mt-1 text-[10px] text-slate-500">Continue with the lesson material below.</p></div></div>
            )}

            <article className="mt-7 max-w-3xl"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Lesson content</p><div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{hasLessons ? lesson.content : module.content}</div></article>

            {(hasLessons ? lesson.resources : module.resources).length > 0 && <section className="mt-7 rounded-xl border border-slate-200 bg-[#f8fbff] p-4"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /><h2 className="text-xs font-bold text-[#1C1D52]">Materials for this {hasLessons ? 'lesson' : 'module'}</h2></div><div className="mt-3 space-y-2">{(hasLessons ? lesson.resources : module.resources).map((resource) => <button type="button" key={resource} className="flex w-full items-center gap-3 rounded-lg bg-white px-3 py-2.5 text-left text-xs text-slate-600 hover:text-blue-600"><Download className="h-3.5 w-3.5 text-[#5FBB46]" />{resource}</button>)}</div></section>}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => setCompleted((value) => !value)} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold ${completed ? 'bg-[#e8faf7] text-teal-700' : 'bg-[#5FBB46] text-[#14204f]'}`}>{completed ? <CheckCircle2 className="h-4 w-4" /> : <Check className="h-4 w-4" />}{completed ? 'Lesson completed' : 'Mark as complete'}</button><button type="button" onClick={goNext} disabled={selectedModule === modules.length - 1 && (!hasLessons || selectedLesson === module.lessons.length - 1)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#1C1D52] disabled:cursor-not-allowed disabled:opacity-40">Next content<ArrowRight className="h-4 w-4" /></button></div>
          </div>
        </main>
      </div>
    </div>
  )
}
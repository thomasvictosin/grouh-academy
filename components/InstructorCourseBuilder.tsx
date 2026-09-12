'use client'

import { ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, CircleCheckBig, FileText, ImagePlus, Layers3, Plus, Save, Send, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Lesson = { id: string; title: string; videoUrl: string; content: string; resources: string; resourceIds: string[] }
type Module = { id: string; title: string; duration: string; summary: string; hasLessons: boolean; videoUrl: string; content: string; resources: string; lessons: Lesson[] }
type Question = { id: number; question: string; options: string[]; answer: string }
type SavedCourse = {
  id: string
  slug: string
  title: string
  description: string | null
  thumbnail: string | null
  price: number
  status: string
  category: { name: string } | null
  modules: Array<{
    id: string
    title: string
    description: string | null
    lessons: Array<{
      id: string
      title: string
      content: string | null
      videoUrl: string | null
      resources: Array<{ id: string; url: string }>
    }>
  }>
}

const steps = [
  { label: 'Basics', icon: BookOpen },
  { label: 'Curriculum', icon: Layers3 },
  { label: 'Media', icon: FileText },
  { label: 'Publish', icon: ImagePlus },
  { label: 'Review', icon: CircleCheckBig },
]

const emptyCourse = {
  title: 'AI Product Design Bootcamp',
  category: 'Design',
  level: 'Intermediate',
  duration: '6 weeks',
  price: '$149',
  launchDate: '2026-10-15',
  description: 'A hands-on course covering product thinking, UX research, interface systems, and rapid prototyping for digital products.',
  objectives: 'Design better product experiences, work with real user feedback, and build a portfolio-ready case study.',
  videoUrl: '',
  thumbnail: '',
}

const startingModules: Module[] = [{ id: 'new-1', title: 'Foundations of Product Design', duration: '1h 40m', summary: '', hasLessons: true, videoUrl: '', content: '', resources: '', lessons: [{ id: 'new-11', title: 'What makes a product useful?', videoUrl: '', content: '', resources: '', resourceIds: [] }] }]
const startingQuestions: Question[] = [{ id: 1, question: 'What is the primary goal of user research?', options: ['To make designs look aesthetic', 'To understand user needs and pain points', 'To code faster', 'To reduce course duration'], answer: 'To understand user needs and pain points' }]

function newItemId() {
  return `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function persistedId(id: string) {
  return id.startsWith('new-') ? undefined : id
}

function hydrateModules(course: SavedCourse): Module[] {
  if (!course.modules.length) return []
  return course.modules.map((module) => ({
    id: module.id,
    title: module.title,
    duration: '',
    summary: module.description ?? '',
    hasLessons: module.lessons.length > 0,
    videoUrl: '',
    content: '',
    resources: '',
    lessons: module.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl ?? '',
      content: lesson.content ?? '',
      resources: lesson.resources.map((resource) => resource.url).join('\n'),
      resourceIds: lesson.resources.map((resource) => resource.id),
    })),
  }))
}

export default function InstructorCourseBuilder({ mode = 'create', courseSlug, courseTitle }: { mode?: 'create' | 'edit'; courseSlug?: string; courseTitle?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(0)
  const [course, setCourse] = useState({ ...emptyCourse, title: courseTitle ?? emptyCourse.title })
  const [modules, setModules] = useState(mode === 'edit' ? [] : startingModules)
  const [quizEnabled, setQuizEnabled] = useState(true)
  const [quizTitle, setQuizTitle] = useState('Module Checkpoint Quiz')
  const [quizPassingScore, setQuizPassingScore] = useState('80')
  const [questions, setQuestions] = useState(startingQuestions)
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit' && Boolean(courseSlug))
  const [persistedSlug, setPersistedSlug] = useState(courseSlug ?? '')
  const isEditMode = mode === 'edit' || Boolean(persistedSlug)
  const progress = ((currentStep + 1) / steps.length) * 100
  const field = (name: string, value: string) => setCourse((previous) => ({ ...previous, [name]: value }))
  const updateModule = (id: string, key: keyof Module, value: string | boolean) => setModules((items) => items.map((item) => item.id === id ? { ...item, [key]: value } : item))
  const addModule = () => setModules((items) => [...items, { id: newItemId(), title: `Module ${items.length + 1}`, duration: '45m', summary: '', hasLessons: true, videoUrl: '', content: '', resources: '', lessons: [] }])
  const removeModule = (id: string) => setModules((items) => items.filter((item) => item.id !== id))
  const addLesson = (moduleId: string) => setModules((items) => items.map((item) => item.id === moduleId ? { ...item, lessons: [...item.lessons, { id: newItemId(), title: `Lesson ${item.lessons.length + 1}`, videoUrl: '', content: '', resources: '', resourceIds: [] }] } : item))
  const removeLesson = (moduleId: string, lessonId: string) => setModules((items) => items.map((item) => item.id === moduleId ? { ...item, lessons: item.lessons.filter((lesson) => lesson.id !== lessonId) } : item))
  const updateLesson = (moduleId: string, lessonId: string, key: keyof Lesson, value: string) => setModules((items) => items.map((item) => item.id === moduleId ? { ...item, lessons: item.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, [key]: value } : lesson) } : item))
  const addQuestion = () => setQuestions((items) => [...items, { id: Date.now(), question: `Question ${items.length + 1}`, options: ['Option A', 'Option B', 'Option C', 'Option D'], answer: 'Option A' }])

  const applySavedCourse = (data: SavedCourse) => {
    setPersistedSlug(data.slug)
    setCourse((previous) => ({
      ...previous,
      title: data.title,
      category: data.category?.name ?? previous.category,
      price: `$${data.price}`,
      description: data.description ?? '',
      thumbnail: data.thumbnail ?? '',
    }))
    setModules(hydrateModules(data))
  }

  useEffect(() => {
    if (mode !== 'edit' || !courseSlug) return
    let cancelled = false
    const load = async () => {
      const response = await fetch(`/api/courses/${courseSlug}`)
      const data = await response.json() as SavedCourse & { error?: string }
      if (cancelled) return
      if (!response.ok) {
        setMessage(data.error ?? 'Unable to load course.')
        setLoading(false)
        return
      }
      applySavedCourse(data)
      setLoading(false)
    }
    void load()
    return () => { cancelled = true }
  }, [mode, courseSlug])

  const persistCourse = async (submitForReview = false) => {
    setSaving(true)
    setMessage(null)
    try {
      const payload = {
        title: course.title,
        description: course.description,
        category: course.category,
        price: Number(course.price.replace(/[^0-9.]/g, '')) || 0,
        thumbnail: course.thumbnail || null,
        modules: modules.map((module) => ({
          id: persistedId(module.id),
          title: module.title,
          description: module.summary,
          lessons: module.lessons.map((lesson) => {
            const urls = lesson.resources.split('\n').map((line) => line.trim()).filter(Boolean)
            return {
              id: persistedId(lesson.id),
              title: lesson.title,
              content: lesson.content,
              videoUrl: lesson.videoUrl,
              resources: urls.map((url, index) => ({ id: persistedId(lesson.resourceIds[index] || `new-resource-${index}`), title: url, type: 'link', url })),
            }
          }),
        })),
      }
      const targetSlug = persistedSlug || courseSlug
      const response = targetSlug
        ? await fetch(`/api/courses/${targetSlug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        : await fetch('/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await response.json() as SavedCourse & { error?: string }
      if (!response.ok || !data.slug) { setMessage(data.error ?? 'Unable to save course.'); return }
      applySavedCourse(data)
      if (submitForReview) {
        const submission = await fetch(`/api/courses/${data.slug}/submit`, { method: 'POST' })
        if (!submission.ok) { const result = await submission.json() as { error?: string }; setMessage(result.error ?? 'Unable to submit course.'); return }
        setMessage('Course submitted for admin review.')
      } else setMessage('Course saved successfully.')
      if (!targetSlug && pathname.startsWith('/instructor/courses')) router.replace(`/instructor/courses/${data.slug}/edit`)
      router.refresh()
    } catch {
      setMessage('Unable to save course.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="rounded-2xl bg-white p-6 text-sm text-slate-500">Loading course...</p>

  return <div className="mx-auto max-w-[1100px] space-y-5"><Link href="/instructor/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600"><ArrowLeft className="h-4 w-4" />Back to Courses</Link><header className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Course Builder</p><h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1></div><button type="button" onClick={() => void persistCourse()} disabled={saving} className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#1C1D52] disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save Draft'}</button></div>{message && <p className="mt-4 text-xs font-semibold text-[#397d3a]" role="status">{message}</p>}<div className="mt-5"><div className="mb-2 flex justify-between text-[10px] font-semibold text-slate-500"><span>Progress</span><span>{Math.round(progress)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#5FBB46] transition-all" style={{ width: `${progress}%` }} /></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{steps.map((step, index) => { const Icon = step.icon; const active = index === currentStep; const complete = index < currentStep; return <button type="button" key={step.label} onClick={() => setCurrentStep(index)} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${active ? 'border-blue-500 bg-blue-500/5' : complete ? 'border-[#5FBB46] bg-[#e8faf7]' : 'border-slate-200'}`}><span className={`flex h-7 w-7 items-center justify-center rounded-md ${active ? 'bg-blue-500 text-white' : complete ? 'bg-[#5FBB46] text-white' : 'bg-slate-100 text-slate-500'}`}>{complete ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}</span><span><span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Step {index + 1}</span><span className="mt-0.5 block text-xs font-semibold text-[#1C1D52]">{step.label}</span></span></button> })}</div></header><section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">{currentStep === 0 && <BuilderBasics course={course} field={field} />}{currentStep === 1 && <BuilderCurriculum modules={modules} updateModule={updateModule} addModule={addModule} removeModule={removeModule} addLesson={addLesson} removeLesson={removeLesson} updateLesson={updateLesson} />}{currentStep === 2 && <BuilderMedia course={course} field={field} quizEnabled={quizEnabled} setQuizEnabled={setQuizEnabled} quizTitle={quizTitle} setQuizTitle={setQuizTitle} quizPassingScore={quizPassingScore} setQuizPassingScore={setQuizPassingScore} questions={questions} setQuestions={setQuestions} addQuestion={addQuestion} />}{currentStep === 3 && <BuilderPublish course={course} field={field} />}{currentStep === 4 && <BuilderReview course={course} modules={modules} quizEnabled={quizEnabled} questions={questions} />}</section><div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><button type="button" onClick={() => setCurrentStep((value) => Math.max(0, value - 1))} disabled={currentStep === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-[#1C1D52] disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>{currentStep < steps.length - 1 ? <button type="button" onClick={() => setCurrentStep((value) => Math.min(steps.length - 1, value + 1))} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">Next<ChevronRight className="h-4 w-4" /></button> : <button type="button" onClick={() => void persistCourse(true)} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] disabled:opacity-60"><Send className="h-4 w-4" />{saving ? 'Submitting...' : 'Submit for Admin Review'}</button>}</div></div>
}

function BuilderBasics({ course, field }: { course: Record<string, string>; field: (name: keyof typeof course, value: string) => void }) { return <><BuilderHeading icon={<BookOpen className="h-4 w-4" />} title="Course basics" text="Define the learning objective and primary structure." /><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input label="Course title" value={course.title} onChange={(value) => field('title', value)} /><Input label="Category" value={course.category} onChange={(value) => field('category', value)} /><Input label="Level" value={course.level} onChange={(value) => field('level', value)} /><Input label="Duration" value={course.duration} onChange={(value) => field('duration', value)} /><Input label="Price" value={course.price} onChange={(value) => field('price', value)} /></div><Textarea label="Course summary" value={course.description} onChange={(value) => field('description', value)} rows={5} /><Textarea label="Learning goals" value={course.objectives} onChange={(value) => field('objectives', value)} rows={3} /></> }
function BuilderCurriculum({ modules, updateModule, addModule, removeModule, addLesson, removeLesson, updateLesson }: { modules: Module[]; updateModule: (id: string, key: keyof Module, value: string | boolean) => void; addModule: () => void; removeModule: (id: string) => void; addLesson: (id: string) => void; removeLesson: (moduleId: string, lessonId: string) => void; updateLesson: (moduleId: string, lessonId: string, key: keyof Lesson, value: string) => void }) { return <><div className="flex items-center justify-between gap-3"><BuilderHeading icon={<Layers3 className="h-4 w-4" />} title="Curriculum" text="Structure modules, optional lessons, and learning content." /><button type="button" onClick={addModule} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]"><Plus className="h-3.5 w-3.5" />Add module</button></div><div className="mt-5 space-y-5">{modules.map((module, index) => <div key={module.id} className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-[#1C1D52]">Module {index + 1}</p>{modules.length > 1 && <button type="button" onClick={() => removeModule(module.id)} className="text-[10px] font-semibold text-red-500">Remove</button>}</div><div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]"><Input label="Module title" value={module.title} onChange={(value) => updateModule(module.id, 'title', value)} /><Input label="Estimated duration" value={module.duration} onChange={(value) => updateModule(module.id, 'duration', value)} /></div><Textarea label="Module summary" value={module.summary} onChange={(value) => updateModule(module.id, 'summary', value)} rows={2} /><div className="mt-4 grid gap-2 sm:grid-cols-2"><button type="button" onClick={() => updateModule(module.id, 'hasLessons', true)} className={`rounded-lg border p-3 text-left ${module.hasLessons ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}><b className="block text-xs text-[#1C1D52]">Use lessons</b><span className="text-[10px] text-slate-500">Add multiple lessons with their own content.</span></button><button type="button" onClick={() => updateModule(module.id, 'hasLessons', false)} className={`rounded-lg border p-3 text-left ${!module.hasLessons ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}><b className="block text-xs text-[#1C1D52]">Direct module content</b><span className="text-[10px] text-slate-500">Use one complete module content block.</span></button></div>{module.hasLessons ? <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/40 p-3"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[#1C1D52]">Lessons</p><p className="text-[10px] text-slate-500">Lessons are optional.</p></div><button type="button" onClick={() => addLesson(module.id)} className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[10px] font-semibold text-blue-700"><Plus className="h-3.5 w-3.5" />Add lesson</button></div>{module.lessons.map((lesson, lessonIndex) => <div key={lesson.id} className="mt-3 rounded-lg border border-slate-200 bg-white p-3"><div className="flex justify-between"><p className="text-xs font-semibold text-[#1C1D52]">Lesson {lessonIndex + 1}</p><button type="button" onClick={() => removeLesson(module.id, lesson.id)} aria-label="Remove lesson"><Trash2 className="h-3.5 w-3.5 text-red-400" /></button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><Input label="Lesson title" value={lesson.title} onChange={(value) => updateLesson(module.id, lesson.id, 'title', value)} /><Input label="Lesson video URL" value={lesson.videoUrl} onChange={(value) => updateLesson(module.id, lesson.id, 'videoUrl', value)} /></div><Textarea label="Lesson text / content" value={lesson.content} onChange={(value) => updateLesson(module.id, lesson.id, 'content', value)} rows={4} /><Textarea label="Learning materials and resources" value={lesson.resources} onChange={(value) => updateLesson(module.id, lesson.id, 'resources', value)} rows={2} /></div>)}</div> : <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3"><Input label="Module video URL" value={module.videoUrl} onChange={(value) => updateModule(module.id, 'videoUrl', value)} /><Textarea label="Module text / content" value={module.content} onChange={(value) => updateModule(module.id, 'content', value)} rows={5} /><Textarea label="Learning materials and resources" value={module.resources} onChange={(value) => updateModule(module.id, 'resources', value)} rows={2} /></div>}</div>)}</div></> }
function BuilderMedia({ course, field, quizEnabled, setQuizEnabled, quizTitle, setQuizTitle, quizPassingScore, setQuizPassingScore, questions, setQuestions, addQuestion }: { course: Record<string, string>; field: (name: keyof typeof course, value: string) => void; quizEnabled: boolean; setQuizEnabled: (value: boolean) => void; quizTitle: string; setQuizTitle: (value: string) => void; quizPassingScore: string; setQuizPassingScore: (value: string) => void; questions: Question[]; setQuestions: (questions: Question[]) => void; addQuestion: () => void }) { return <><BuilderHeading icon={<FileText className="h-4 w-4" />} title="Media & assessment" text="Add a course trailer and optional quiz." /><div className="mt-5 rounded-xl border border-slate-200 bg-[#f8fbff] p-4"><Input label="Course trailer video URL" value={course.videoUrl} onChange={(value) => field('videoUrl', value)} placeholder="https://www.youtube.com/watch?v=..." /><div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-center text-xs text-slate-500">{course.videoUrl ? 'Course media preview ready' : 'Add a course trailer URL to preview media'}</div></div><div className="mt-5 rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-[#1C1D52]">Course quiz</p><p className="text-[10px] text-slate-500">Optional assessment for learners.</p></div><button type="button" onClick={() => setQuizEnabled(!quizEnabled)} className={`h-6 w-11 rounded-full ${quizEnabled ? 'bg-[#5FBB46]' : 'bg-slate-200'}`}><span className={`mx-1 block h-4 w-4 rounded-full bg-white ${quizEnabled ? 'translate-x-5' : ''}`} /></button></div>{quizEnabled && <div className="mt-4 space-y-4"><div className="grid gap-3 sm:grid-cols-2"><Input label="Quiz title" value={quizTitle} onChange={setQuizTitle} /><Input label="Passing score (%)" value={quizPassingScore} onChange={setQuizPassingScore} /></div>{questions.map((question, index) => <div key={question.id} className="rounded-lg border border-slate-200 p-3"><p className="text-xs font-semibold text-[#1C1D52]">Question {index + 1}</p><Input label="Question" value={question.question} onChange={(value) => setQuestions(questions.map((item) => item.id === question.id ? { ...item, question: value } : item))} /></div>)}<button type="button" onClick={addQuestion} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-bold text-[#1C1D52]"><Plus className="h-3.5 w-3.5" />Add question</button></div>}</div></> }
function BuilderPublish({ course, field }: { course: Record<string, string>; field: (name: keyof typeof course, value: string) => void }) { return <><BuilderHeading icon={<ImagePlus className="h-4 w-4" />} title="Publish settings" text="Prepare the course for admin review." /><div className="mt-5 grid gap-4 sm:grid-cols-2"><Input label="Launch date" value={course.launchDate} onChange={(value) => field('launchDate', value)} /><Input label="Course thumbnail" value={course.thumbnail} onChange={(value) => field('thumbnail', value)} /></div><div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">Instructors can save drafts and submit courses for review. Only an administrator can publish this course.</div></> }
function BuilderReview({ course, modules, quizEnabled, questions }: { course: Record<string, string>; modules: Module[]; quizEnabled: boolean; questions: Question[] }) { return <><BuilderHeading icon={<CircleCheckBig className="h-4 w-4" />} title="Review and submit" text="Check the final setup before sending it to an administrator." /><div className="mt-5 grid gap-3 lg:grid-cols-2"><div className="space-y-3"><Summary label="Course title" value={course.title} /><Summary label="Category" value={course.category} /><Summary label="Modules" value={`${modules.length} modules`} /><Summary label="Quiz" value={quizEnabled ? `${questions.length} questions` : 'Not included'} /></div><div className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4"><p className="text-xs font-bold text-[#1C1D52]">Student experience preview</p><p className="mt-3 text-sm leading-6 text-slate-600">{course.description}</p><p className="mt-4 text-[10px] text-slate-500">Your submission will be marked In review until an admin approves it.</p></div></div></> }
function BuilderHeading({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600">{icon}</span><div><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2><p className="text-[10px] text-slate-500">{text}</p></div></div> }
function Input({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <label className="mt-3 block text-[10px] font-semibold text-[#1C1D52]">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400" /></label> }
function Textarea({ label, value, onChange, rows }: { label: string; value: string; onChange: (value: string) => void; rows: number }) { return <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" /></label> }
function Summary({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 rounded-lg bg-[#f8fbff] px-4 py-3 text-[11px]"><span className="font-semibold text-[#1C1D52]">{label}</span><span className="text-right text-slate-600">{value}</span></div> }

'use client'

import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  FileText,
  ImagePlus,
  Layers3,
  Plus,
  Rocket,
  Save,
  Sparkles,
  Tag,
  Trash2,
  Users,
  Video,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import AdminShell from '@/components/AdminShell'

type Lesson = {
  id: number
  title: string
  videoUrl: string
  content: string
  resources: string
}

type Module = {
  id: number
  title: string
  duration: string
  summary: string
  hasLessons: boolean
  videoUrl: string
  content: string
  resources: string
  lessons: Lesson[]
}

type QuizQuestion = {
  id: number
  question: string
  options: string[]
  answer: string
}

const stepMeta = [
  { id: 'basics', label: 'Basics', icon: BookOpen },
  { id: 'curriculum', label: 'Curriculum', icon: Layers3 },
  { id: 'media', label: 'Media', icon: FileText },
  { id: 'publish', label: 'Publish', icon: Rocket },
  { id: 'review', label: 'Review', icon: CircleCheckBig },
] as const

export default function NewCoursePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [course, setCourse] = useState({
    title: 'AI Product Design Bootcamp',
    category: 'Design',
    instructor: 'Sarah Johnson',
    level: 'Intermediate',
    duration: '6 weeks',
    price: '$149',
    status: 'Draft',
    launchDate: '2026-10-15',
    description: 'A hands-on course covering product thinking, UX research, interface systems, and rapid prototyping for digital products.',
    objectives: 'Design better product experiences, work with real user feedback, and build a portfolio-ready case study.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  })

  const [modules, setModules] = useState<Module[]>([
    {
      id: 1,
      title: 'Foundations of Product Design',
      duration: '1h 40m',
      summary: 'Learn the principles that guide useful, accessible, and intentional product experiences.',
      hasLessons: true,
      videoUrl: '',
      content: '',
      resources: '',
      lessons: [
        { id: 11, title: 'What makes a product useful?', videoUrl: '', content: 'Introduce the core principles of product design and the role of the designer.', resources: 'Product design glossary\nRecommended reading: The Design of Everyday Things' },
        { id: 12, title: 'Defining the problem', videoUrl: '', content: '', resources: '' },
      ],
    },
    {
      id: 2,
      title: 'Research & User Insight',
      duration: '1h 10m',
      summary: 'A direct module reading on how to turn user evidence into product decisions.',
      hasLessons: false,
      videoUrl: '',
      content: 'Use this area for modules that work as one complete reading, workshop, or resource pack.',
      resources: 'User interview template\nResearch synthesis worksheet',
      lessons: [],
    },
    {
      id: 3,
      title: 'Design Systems & Prototyping',
      duration: '2h 20m',
      summary: '',
      hasLessons: true,
      videoUrl: '',
      content: '',
      resources: '',
      lessons: [],
    },
  ])

  const [quizEnabled, setQuizEnabled] = useState(true)
  const [quizTitle, setQuizTitle] = useState('Module Checkpoint Quiz')
  const [quizPassingScore, setQuizPassingScore] = useState('80')
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { id: 1, question: 'What is the primary goal of user research?', options: ['To make designs look aesthetic', 'To understand user needs and pain points', 'To code faster', 'To reduce course duration'], answer: 'To understand user needs and pain points' },
    { id: 2, question: 'Which design step usually comes before prototyping?', options: ['Publishing', 'Wireframing', 'Tracking sales', 'Data backup'], answer: 'Wireframing' },
  ])

  const totalSteps = stepMeta.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const updateField = (field: keyof typeof course, value: string) => {
    setCourse((previous) => ({ ...previous, [field]: value }))
  }

  const addModule = () => {
    setModules((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: `Module ${previous.length + 1}`,
        duration: '45m',
        summary: '',
        hasLessons: true,
        videoUrl: '',
        content: '',
        resources: '',
        lessons: [],
      },
    ])
  }

  const updateModule = (id: number, field: keyof Module, value: string | boolean) => {
    setModules((previous) => previous.map((module) => (module.id === id ? { ...module, [field]: value } : module)))
  }

  const addLesson = (moduleId: number) => {
    setModules((previous) => previous.map((module) => module.id === moduleId
      ? { ...module, lessons: [...module.lessons, { id: Date.now(), title: `Lesson ${module.lessons.length + 1}`, videoUrl: '', content: '', resources: '' }] }
      : module))
  }

  const updateLesson = (moduleId: number, lessonId: number, field: keyof Lesson, value: string) => {
    setModules((previous) => previous.map((module) => module.id === moduleId
      ? { ...module, lessons: module.lessons.map((lesson) => lesson.id === lessonId ? { ...lesson, [field]: value } : lesson) }
      : module))
  }

  const removeLesson = (moduleId: number, lessonId: number) => {
    setModules((previous) => previous.map((module) => module.id === moduleId
      ? { ...module, lessons: module.lessons.filter((lesson) => lesson.id !== lessonId) }
      : module))
  }

  const removeModule = (id: number) => {
    setModules((previous) => (previous.length > 1 ? previous.filter((module) => module.id !== id) : previous))
  }

  const nextStep = () => setCurrentStep((value) => Math.min(value + 1, totalSteps - 1))
  const previousStep = () => setCurrentStep((value) => Math.max(value - 1, 0))

  const addQuizQuestion = () => {
    const nextId = Date.now()
    setQuizQuestions((previous) => [
      ...previous,
      {
        id: nextId,
        question: `Question ${previous.length + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'Option A',
      },
    ])
  }

  const updateQuestion = (id: number, field: 'question' | 'answer', value: string) => {
    setQuizQuestions((previous) => previous.map((question) => (question.id === id ? { ...question, [field]: value } : question)))
  }

  const updateQuestionOptions = (id: number, index: number, value: string) => {
    setQuizQuestions((previous) =>
      previous.map((question) => {
        if (question.id !== id) return question
        const options = [...question.options]
        options[index] = value
        return { ...question, options }
      }),
    )
  }

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[1100px] space-y-5">
        <Link href="/admin/student/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        <header className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Course Builder</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Create New Course</h1>
            </div>
            <button type="button" className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-slate-500">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#5FBB46] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {stepMeta.map((step, index) => {
              const Icon = step.icon
              const active = index === currentStep
              const complete = index < currentStep

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${active ? 'border-blue-500 bg-blue-500/5' : complete ? 'border-[#5FBB46] bg-[#e8faf7]' : 'border-slate-200 bg-white'}`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md ${active ? 'bg-blue-500 text-white' : complete ? 'bg-[#5FBB46] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {complete ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  </span>
                  <span>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Step {index + 1}</span>
                    <span className="mt-0.5 block text-xs font-semibold text-[#1C1D52]">{step.label}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </header>

        <form className="space-y-5">
          {currentStep === 0 && (
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600"><BookOpen className="h-4 w-4" /></span>
                <div>
                  <h2 className="text-sm font-bold text-[#1C1D52]">Course basics</h2>
                  <p className="text-[10px] text-slate-500">Define the learning objective and primary structure.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Course title" value={course.title} onChange={(value) => updateField('title', value)} placeholder="Advanced Product Design" />
                <Field label="Category" value={course.category} onChange={(value) => updateField('category', value)} placeholder="Design" />
                <Field label="Instructor" value={course.instructor} onChange={(value) => updateField('instructor', value)} placeholder="Sarah Johnson" />
                <Field label="Level" value={course.level} onChange={(value) => updateField('level', value)} placeholder="Intermediate" />
                <Field label="Duration" value={course.duration} onChange={(value) => updateField('duration', value)} placeholder="6 weeks" />
                <Field label="Price" value={course.price} onChange={(value) => updateField('price', value)} placeholder="$149" />
              </div>

              <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                Course summary
                <textarea value={course.description} onChange={(event) => updateField('description', event.target.value)} rows={5} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" />
              </label>

              <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                Learning goals
                <textarea value={course.objectives} onChange={(event) => updateField('objectives', event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </section>
          )}

          {currentStep === 1 && (
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600"><Layers3 className="h-4 w-4" /></span>
                  <div>
                    <h2 className="text-sm font-bold text-[#1C1D52]">Curriculum</h2>
                    <p className="text-[10px] text-slate-500">Structure the learning path and module flow.</p>
                  </div>
                </div>
                <button type="button" onClick={addModule} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-3 py-2 text-[10px] font-semibold text-[#14204f]">
                  <Plus className="h-3.5 w-3.5" />
                  Add module
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {modules.map((module, index) => (
                  <div key={module.id} className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-[#1C1D52]">Module {index + 1}</p>
                        <p className="mt-1 text-[10px] text-slate-500">Build the module container, then choose how its content is organized.</p>
                      </div>
                      {modules.length > 1 && (
                        <button type="button" onClick={() => removeModule(module.id)} className="text-[10px] font-semibold text-red-500">Remove</button>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
                      <Field label="Module title" value={module.title} onChange={(value) => updateModule(module.id, 'title', value)} placeholder="User Research" />
                      <Field label="Estimated duration" value={module.duration} onChange={(value) => updateModule(module.id, 'duration', value)} placeholder="1h 40m" />
                    </div>

                    <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                      Module summary
                      <textarea value={module.summary} onChange={(event) => updateModule(module.id, 'summary', event.target.value)} rows={2} placeholder="What will learners understand or be able to do after this module?" className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                    </label>

                    <div className="mt-5 rounded-lg border border-slate-200 bg-white p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">Content structure</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <button type="button" onClick={() => updateModule(module.id, 'hasLessons', true)} className={`rounded-lg border px-3 py-3 text-left ${module.hasLessons ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                          <span className="block text-xs font-semibold text-[#1C1D52]">Use lessons</span>
                          <span className="mt-1 block text-[10px] text-slate-500">Add multiple lessons, each with its own content.</span>
                        </button>
                        <button type="button" onClick={() => updateModule(module.id, 'hasLessons', false)} className={`rounded-lg border px-3 py-3 text-left ${!module.hasLessons ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                          <span className="block text-xs font-semibold text-[#1C1D52]">Direct module content</span>
                          <span className="mt-1 block text-[10px] text-slate-500">Keep this module as one complete content block.</span>
                        </button>
                      </div>
                    </div>

                    {module.hasLessons ? (
                      <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/40 p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-[#1C1D52]">Lessons</p>
                            <p className="mt-1 text-[10px] text-slate-500">Lessons are optional. Add as many as this module needs.</p>
                          </div>
                          <button type="button" onClick={() => addLesson(module.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[10px] font-semibold text-blue-700">
                            <Plus className="h-3.5 w-3.5" />
                            Add lesson
                          </button>
                        </div>

                        {module.lessons.length === 0 ? (
                          <div className="mt-3 rounded-lg border border-dashed border-blue-200 bg-white px-4 py-5 text-center text-[10px] text-slate-500">No lessons added yet. This module can remain empty until you are ready.</div>
                        ) : (
                          <div className="mt-4 space-y-4">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-xs font-semibold text-[#1C1D52]">Lesson {lessonIndex + 1}</p>
                                  <button type="button" onClick={() => removeLesson(module.id, lesson.id)} className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500">
                                    <Trash2 className="h-3 w-3" />
                                    Remove
                                  </button>
                                </div>

                                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                                  <Field label="Lesson title" value={lesson.title} onChange={(value) => updateLesson(module.id, lesson.id, 'title', value)} placeholder="Define the problem" />
                                  <label className="block text-[10px] font-semibold text-[#1C1D52]">
                                    Lesson video URL
                                    <span className="relative mt-2 block">
                                      <Video className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                                      <input value={lesson.videoUrl} onChange={(event) => updateLesson(module.id, lesson.id, 'videoUrl', event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                                    </span>
                                  </label>
                                </div>

                                <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                                  Lesson text / content
                                  <textarea value={lesson.content} onChange={(event) => updateLesson(module.id, lesson.id, 'content', event.target.value)} rows={4} placeholder="Write the lesson explanation, instructions, or reading content here." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                                </label>

                                <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                                  Learning materials and resources
                                  <textarea value={lesson.resources} onChange={(event) => updateLesson(module.id, lesson.id, 'resources', event.target.value)} rows={2} placeholder="Add links, downloads, templates, or required materials (one per line)." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/50 p-3 sm:p-4">
                        <p className="text-xs font-semibold text-[#1C1D52]">Direct module content</p>
                        <p className="mt-1 text-[10px] text-slate-500">This module has no individual lessons. Add the complete content and resources here.</p>

                        <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                          Module video URL
                          <input value={module.videoUrl} onChange={(event) => updateModule(module.id, 'videoUrl', event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                        </label>
                        <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                          Module text / content
                          <textarea value={module.content} onChange={(event) => updateModule(module.id, 'content', event.target.value)} rows={5} placeholder="Write the complete module content here." className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                        </label>
                        <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
                          Learning materials and resources
                          <textarea value={module.resources} onChange={(event) => updateModule(module.id, 'resources', event.target.value)} rows={2} placeholder="Add links, downloads, templates, or required materials (one per line)." className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400" />
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600"><FileText className="h-4 w-4" /></span>
                <div>
                  <h2 className="text-sm font-bold text-[#1C1D52]">Media & assessment</h2>
                  <p className="text-[10px] text-slate-500">Add a promo video and optional quiz assessment for learners.</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-[#f8fbff] p-4">
                <label className="block text-[10px] font-semibold text-[#1C1D52]">
                  Course trailer video URL
                  <input
                    value={course.videoUrl}
                    onChange={(event) => updateField('videoUrl', event.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400"
                  />
                </label>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
                  <div className="aspect-video w-full rounded-lg bg-slate-100 p-3">
                    {course.videoUrl ? (
                      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-[radial-gradient(circle_at_top,_#ffffff,_#eef5ff)] text-center">
                        <div>
                          <p className="text-xs font-semibold text-[#1C1D52]">YouTube preview ready</p>
                          <p className="mt-1 text-[10px] text-slate-500 break-all">{course.videoUrl}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-400">
                        Add a YouTube URL to preview the course video
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-[#1C1D52]">Course quiz</p>
                    <p className="mt-1 text-[10px] text-slate-500">Optional assessment for learners to validate understanding.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuizEnabled((value) => !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${quizEnabled ? 'bg-[#5FBB46]' : 'bg-slate-200'}`}
                    aria-label="Toggle quiz"
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition ${quizEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {quizEnabled && (
                  <div className="mt-4 space-y-4">
                    <Field label="Quiz title" value={quizTitle} onChange={setQuizTitle} placeholder="Module Checkpoint Quiz" />
                    <Field label="Passing score (%)" value={quizPassingScore} onChange={setQuizPassingScore} placeholder="80" />

                    <div className="space-y-3">
                      {quizQuestions.map((question, questionIndex) => (
                        <div key={question.id} className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold text-[#1C1D52]">Question {questionIndex + 1}</p>
                            <button type="button" onClick={() => setQuizQuestions((previous) => previous.filter((item) => item.id !== question.id))} className="text-[10px] font-semibold text-red-500">Remove</button>
                          </div>

                          <label className="mt-3 block text-[10px] font-semibold text-[#1C1D52]">
                            Question
                            <input
                              value={question.question}
                              onChange={(event) => updateQuestion(question.id, 'question', event.target.value)}
                              className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400"
                            />
                          </label>

                          <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {question.options.map((option, optionIndex) => (
                              <label key={`${question.id}-${optionIndex}`} className="block text-[10px] font-semibold text-[#1C1D52]">
                                Option {optionIndex + 1}
                                <input
                                  value={option}
                                  onChange={(event) => updateQuestionOptions(question.id, optionIndex, event.target.value)}
                                  className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400"
                                />
                              </label>
                            ))}
                          </div>

                          <label className="mt-3 block text-[10px] font-semibold text-[#1C1D52]">
                            Correct answer
                            <select
                              value={question.answer}
                              onChange={(event) => updateQuestion(question.id, 'answer', event.target.value)}
                              className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400"
                            >
                              {question.options.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          </label>
                        </div>
                      ))}
                    </div>

                    <button type="button" onClick={addQuizQuestion} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52]">
                      <Plus className="h-3.5 w-3.5" />
                      Add question
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600"><Rocket className="h-4 w-4" /></span>
                <div>
                  <h2 className="text-sm font-bold text-[#1C1D52]">Publish settings</h2>
                  <p className="text-[10px] text-slate-500">Choose the publishing state and launch details.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block text-[10px] font-semibold text-[#1C1D52]">
                  Status
                  <select value={course.status} onChange={(event) => updateField('status', event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                    <option>Draft</option>
                    <option>Pending</option>
                    <option>Published</option>
                  </select>
                </label>
                <Field label="Launch date" value={course.launchDate} onChange={(value) => updateField('launchDate', value)} placeholder="2026-10-15" type="date" />
              </div>

              <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-[#f8fbff] p-4">
                <div className="flex items-center gap-3 text-[#1C1D52]">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-500 shadow-sm">
                    <ImagePlus className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold">Course thumbnail</p>
                    <p className="text-[10px] text-slate-500">Upload a cover image for the course detail page and catalog.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {currentStep === 4 && (
            <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600"><CircleCheckBig className="h-4 w-4" /></span>
                <div>
                  <h2 className="text-sm font-bold text-[#1C1D52]">Review and publish</h2>
                  <p className="text-[10px] text-slate-500">Check the final setup before publishing.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-3">
                  <SummaryRow label="Course title" value={course.title} />
                  <SummaryRow label="Category" value={course.category} />
                  <SummaryRow label="Instructor" value={course.instructor} />
                  <SummaryRow label="Duration" value={course.duration} />
                  <SummaryRow label="Price" value={course.price} />
                  <SummaryRow label="Status" value={course.status} />
                  <SummaryRow label="Course video" value={course.videoUrl || 'Not added'} />
                  <SummaryRow label="Quiz" value={quizEnabled ? `${quizQuestions.length} questions · ${quizPassingScore}% pass` : 'Not included'} />
                </div>

                <div className="rounded-xl border border-slate-200 bg-[#f8fbff] p-4">
                  <div className="flex items-center gap-2 text-[#1C1D52]">
                    <Sparkles className="h-4 w-4 text-[#5FBB46]" />
                    <p className="text-xs font-semibold">Course overview</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{course.description}</p>
                  <div className="mt-4 space-y-2 text-[10px] text-slate-600">
                    <InfoPill icon={<Tag className="h-3 w-3" />} text={course.level} />
                    <InfoPill icon={<Users className="h-3 w-3" />} text={`${modules.length} modules`} />
                    <InfoPill icon={<FileText className="h-3 w-3" />} text={course.launchDate} />
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1">{currentStep + 1}/{totalSteps}</span>
              <span>{stepMeta[currentStep].label}</span>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" onClick={previousStep} disabled={currentStep === 0} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {currentStep < totalSteps - 1 ? (
                <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
                  <Save className="h-4 w-4" />
                  Publish Course
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block text-[10px] font-semibold text-[#1C1D52]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none placeholder:text-slate-300 focus:border-blue-400"
      />
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[#f8fbff] px-4 py-3 text-[11px]">
      <span className="font-semibold text-[#1C1D52]">{label}</span>
      <span className="text-slate-600 break-all">{value}</span>
    </div>
  )
}

function InfoPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white px-2.5 py-2 text-slate-600 shadow-sm">
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#dceeff] text-blue-600">{icon}</span>
      {text}
    </div>
  )
}

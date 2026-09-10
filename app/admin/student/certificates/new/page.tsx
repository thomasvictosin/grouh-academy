import { ArrowLeft, Award, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

const students = ['Emma Thompson', 'James Wilson', 'Noah Kim', 'Liam Chen', 'Ava Martinez']
const courses = ['Web Development', 'Data Science Fundamentals', 'UI/UX Design Mastery', 'Python Programming', 'Machine Learning']
const templates = ['Professional Standard', 'Modern Minimal', 'Academic Prestige']

export default function NewCertificatePage() {
  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[920px] space-y-5">
        <Link href="/admin/student/certificates" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Certificates
        </Link>

        <header className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Certificate Management</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Issue Certificate</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#e8faf7] px-3 py-1.5 text-[10px] font-semibold text-teal-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Draft ready
            </div>
          </div>
        </header>

        <form className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dceeff] text-blue-600">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Certificate Details</h2>
                <p className="mt-1 text-[10px] text-slate-500">Assign a student, select the course, and choose a template for the new award.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Student
                <select defaultValue={students[0]} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  {students.map((student) => <option key={student}>{student}</option>)}
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Course
                <select defaultValue={courses[0]} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  {courses.map((course) => <option key={course}>{course}</option>)}
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Template
                <select defaultValue={templates[0]} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  {templates.map((template) => <option key={template}>{template}</option>)}
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Issue Date
                <input defaultValue="2025-02-15" type="date" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Certification Notes</h2>
            <label className="mt-5 block text-[10px] font-semibold text-[#1C1D52]">
              Notes
              <textarea
                rows={4}
                defaultValue="Awarded for successful completion of the selected course with strong project-based outcomes and active participation."
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400"
              />
            </label>
          </section>

          <div className="flex flex-wrap justify-end gap-3 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <Link href="/admin/student/certificates" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link>
            <Link href="/admin/student/certificates" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
              <Award className="h-4 w-4" />
              Issue Certificate
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

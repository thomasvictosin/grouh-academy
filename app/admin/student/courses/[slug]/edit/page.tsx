import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

const courseNames: Record<string, string> = {
  'web-development': 'Web Development',
  'data-science': 'Data Science',
  'ui-ux-design': 'UI/UX Design',
  'python-programming': 'Python Programming',
  'digital-marketing': 'Digital Marketing',
  'advanced-react-patterns': 'Advanced React Patterns',
  'machine-learning': 'Machine Learning',
  'ios-app-development': 'iOS App Development',
  'backend-systems': 'Backend Systems',
}

export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = courseNames[slug] ?? 'Course'

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[900px] space-y-5">
        <Link href={`/admin/student/courses/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        <header>
          <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Edit Course</h1>
          <p className="mt-2 text-xs text-slate-500">Update the details for {name} and keep the catalog current.</p>
        </header>

        <form className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Course Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Course Title" defaultValue={name} />
              <Field label="Category" defaultValue="Web Development" />
              <Field label="Instructor" defaultValue="Sarah Johnson" />
              <Field label="Price" defaultValue="$149" />
              <Field label="Duration" defaultValue="8 weeks" />
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Level
                <select defaultValue="Intermediate" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>
            <label className="mt-4 block text-[10px] font-semibold text-[#1C1D52]">
              Short Description
              <textarea rows={4} defaultValue="Build responsive, scalable products with HTML, CSS, JavaScript, and modern frontend architecture." className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" />
            </label>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Publishing Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Status
                <select defaultValue="Published" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                  <option>Archived</option>
                </select>
              </label>
              <Field label="Course Code" defaultValue={`GROUH-${slug.slice(0, 5).toUpperCase()}`} />
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link href={`/admin/student/courses/${slug}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

function Field({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  return (
    <label className="block text-[10px] font-semibold text-[#1C1D52]">
      {label}
      <input type={type} defaultValue={defaultValue} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
    </label>
  )
}

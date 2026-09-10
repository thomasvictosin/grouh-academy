import { Archive, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react'
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

export default async function ArchiveCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const name = courseNames[slug] ?? 'Course'

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[780px] space-y-5">
        <Link href={`/admin/student/courses/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>

        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4c8] text-amber-600">
              <Archive className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1C1D52]">Archive Course</h1>
              <p className="mt-2 text-sm text-slate-600">This action hides {name} from the public catalog and prevents new enrollments while preserving the course record.</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-[#fffaf1] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-[#1C1D52]">Important notice</p>
                <p className="mt-1 text-[11px] leading-5 text-slate-600">Archived courses remain visible in admin records and can be restored later, but they will no longer appear as active learning options to students.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-[11px] text-slate-600">
            <div className="flex items-center justify-between rounded-lg bg-[#f8fbff] px-4 py-3">
              <span className="font-semibold text-[#1C1D52]">Course</span>
              <span>{name}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f8fbff] px-4 py-3">
              <span className="font-semibold text-[#1C1D52]">Current status</span>
              <span>Published</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f8fbff] px-4 py-3">
              <span className="font-semibold text-[#1C1D52]">Enrollment access</span>
              <span>Disabled after archive</span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap justify-end gap-3">
            <Link href={`/admin/student/courses/${slug}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">
              <CheckCircle2 className="h-4 w-4" />
              Confirm Archive
            </button>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

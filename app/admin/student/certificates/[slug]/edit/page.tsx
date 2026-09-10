'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const certificateFormData: Record<string, { title: string; course: string; student: string; code: string; status: string }> = {
  'cert-902': { title: 'Web Development', course: 'Web Development', student: 'Emma Thompson', code: 'WDB-9204A', status: 'Issued' },
  'cert-901': { title: 'Data Science Fundamentals', course: 'Data Science Fundamentals', student: 'James Wilson', code: 'DSF-1849D', status: 'Issued' },
  'cert-900': { title: 'Machine Learning', course: 'Machine Learning', student: 'Noah Kim', code: 'MLM-3958K', status: 'Issued' },
  'cert-899': { title: 'UI/UX Design Mastery', course: 'UI/UX Design Mastery', student: 'Liam Chen', code: 'UID-8495L', status: 'Pending' },
  'cert-898': { title: 'iOS App Development', course: 'iOS App Development', student: 'Ava Martinez', code: 'IOS-2849M', status: 'Revoked' },
  'cert-897': { title: 'Digital Marketing', course: 'Digital Marketing', student: 'Olivia Patel', code: 'DMB-4859P', status: 'Issued' },
  'cert-896': { title: 'Python Programming', course: 'Python Programming', student: 'Siddharth Sen', code: 'PYT-9204S', status: 'Issued' },
  'cert-895': { title: 'Advanced React', course: 'Advanced React', student: 'Alice Springs', code: 'ARP-1049A', status: 'Issued' },
}

export default function CertificateEditPage() {
  const params = useParams<{ slug: string }>()
  const certificate = certificateFormData[params.slug] ?? certificateFormData['cert-902']

  return (
    <div className="mx-auto max-w-[900px] space-y-5 p-6">
      <Link href={`/admin/student/certificates/${params.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to certificate
      </Link>

      <header>
        <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Edit Certificate</h1>
        <p className="mt-2 text-xs text-slate-500">Update certificate details for {certificate.student}.</p>
      </header>

      <form className="space-y-5">
        <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <h2 className="text-sm font-bold text-[#1C1D52]">Certificate Information</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Certificate Title" defaultValue={certificate.title} />
            <Field label="Course" defaultValue={certificate.course} />
            <Field label="Student" defaultValue={certificate.student} />
            <Field label="Verification Code" defaultValue={certificate.code} />
            <label className="block text-[10px] font-semibold text-[#1C1D52] sm:col-span-2">
              Status
              <select defaultValue={certificate.status} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                <option value="Issued">Issued</option>
                <option value="Pending">Pending</option>
                <option value="Revoked">Revoked</option>
              </select>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-[10px] font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
            <Save className="h-3.5 w-3.5" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block text-[10px] font-semibold text-[#1C1D52]">
      {label}
      <input
        type="text"
        defaultValue={defaultValue}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400"
      />
    </label>
  )
}

import { ArrowLeft, CheckCircle2, Plus, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

export default function NewInstructorPage() {
  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[980px] space-y-5">
        <Link href="/admin/student/instructors" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Instructors
        </Link>

        <header className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5FBB46]">Instructor Onboarding</p>
              <h1 className="mt-2 text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Add Instructor</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#e8faf7] px-3 py-1.5 text-[10px] font-semibold text-teal-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Invitation ready
            </div>
          </div>
        </header>

        <form className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dceeff] text-blue-600">
                <UserRoundPlus className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#1C1D52]">Instructor Profile</h2>
                <p className="mt-1 text-[10px] text-slate-500">Add the educator profile, specialization, and communication details.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Full Name
                <input defaultValue="Olivia Nguyen" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Specialty
                <input defaultValue="Product Design" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Email Address
                <input defaultValue="olivia.nguyen@grouh.com" type="email" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Phone Number
                <input defaultValue="+1 (555) 123-8890" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Course Access</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Department
                <input defaultValue="Design & UX" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Role
                <select defaultValue="Course Instructor" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option>Course Instructor</option>
                  <option>Mentor</option>
                  <option>Reviewer</option>
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Location
                <input defaultValue="Remote" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Status
                <select defaultValue="Pending" className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </label>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <Link href="/admin/student/instructors" className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link>
            <Link href="/admin/student/instructors" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
              <Plus className="h-4 w-4" />
              Invite Instructor
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

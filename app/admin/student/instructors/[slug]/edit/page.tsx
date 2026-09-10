import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import AdminShell from '@/components/AdminShell'

const instructorData: Record<string, { name: string; specialty: string; email: string; phone: string; location: string; department: string; status: string }> = {
  'sarah-johnson': { name: 'Sarah Johnson', specialty: 'Web Development', email: 'sarah.johnson@grouh.com', phone: '+1 (555) 231-9044', location: 'San Francisco, California', department: 'Software Engineering', status: 'Active' },
  'michael-chen': { name: 'Michael Chen', specialty: 'Data Science', email: 'michael.chen@grouh.com', phone: '+1 (555) 614-2290', location: 'Austin, Texas', department: 'Analytics', status: 'Active' },
  'emily-rodriguez': { name: 'Emily Rodriguez', specialty: 'UI/UX Design', email: 'emily.rodriguez@grouh.com', phone: '+1 (555) 392-1458', location: 'New York, New York', department: 'Design', status: 'Active' },
  'david-kim': { name: 'David Kim', specialty: 'Python Programming', email: 'david.kim@grouh.com', phone: '+1 (555) 703-5521', location: 'Seattle, Washington', department: 'Engineering', status: 'Active' },
  'lisa-patel': { name: 'Lisa Patel', specialty: 'Digital Marketing', email: 'lisa.patel@grouh.com', phone: '+1 (555) 271-8813', location: 'Chicago, Illinois', department: 'Marketing', status: 'Pending' },
  'james-wilson': { name: 'James Wilson', specialty: 'Mobile Development', email: 'james.wilson@grouh.com', phone: '+1 (555) 409-6302', location: 'London, United Kingdom', department: 'Product', status: 'Suspended' },
}

export default async function EditInstructorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const instructor = instructorData[slug] ?? instructorData['sarah-johnson']

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[900px] space-y-5">
        <Link href={`/admin/student/instructors/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Instructor Profile
        </Link>

        <header>
          <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Edit Instructor</h1>
          <p className="mt-2 text-xs text-slate-500">Update {instructor.name}&apos;s profile, availability, and teaching assignment.</p>
        </header>

        <form className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Profile Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Full Name
                <input defaultValue={instructor.name} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Specialty
                <input defaultValue={instructor.specialty} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Email Address
                <input defaultValue={instructor.email} type="email" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Phone Number
                <input defaultValue={instructor.phone} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Assignment Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Department
                <input defaultValue={instructor.department} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Status
                <select defaultValue={instructor.status} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52] sm:col-span-2">
                Location
                <input defaultValue={instructor.location} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <Link href={`/admin/student/instructors/${slug}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">Cancel</Link>
            <Link href={`/admin/student/instructors/${slug}`} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e]">
              <Save className="h-4 w-4" />
              Save Changes
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

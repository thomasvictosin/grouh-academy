'use client'

import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminShell from '@/components/AdminShell'

type Instructor = {
  id: string
  name: string
  specialty: string
  email: string
  phone: string
  location: string
  status: 'Active' | 'Pending' | 'Suspended'
  qualification?: string
  bio?: string
}

export default function EditInstructorPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const id = params.slug
  const [instructor, setInstructor] = useState<Instructor | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadInstructor() {
      const response = await fetch('/api/admin/student/instructors')
      if (!response.ok) {
        return
      }

      const payload = (await response.json()) as { instructors?: Instructor[] }
      const item = payload.instructors?.find((entry) => entry.id === id) ?? null
      setInstructor(item)
    }

    void loadInstructor()
  }, [id])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!instructor) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const payload = {
      id: instructor.id,
      name: String(formData.get('name') ?? instructor.name),
      email: String(formData.get('email') ?? instructor.email),
      phone: String(formData.get('phone') ?? instructor.phone),
      specialty: String(formData.get('specialty') ?? instructor.specialty),
      location: String(formData.get('location') ?? instructor.location),
      status: String(formData.get('status') ?? instructor.status),
      qualification: String(formData.get('qualification') ?? instructor.qualification ?? ''),
      bio: String(formData.get('bio') ?? instructor.bio ?? ''),
    }

    setSaving(true)
    setError(null)

    const response = await fetch('/api/admin/student/instructors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null
      setError(result?.error ?? 'Unable to update instructor profile.')
      return
    }

    router.push(`/admin/student/instructors/${id}`)
  }

  if (!instructor) {
    return (
      <AdminShell workspace="student">
        <div className="mx-auto max-w-[900px] rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-[0_7px_20px_rgba(28,29,82,0.08)]">
          Loading instructor profile...
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell workspace="student">
      <div className="mx-auto max-w-[900px] space-y-5">
        <Link href={`/admin/student/instructors/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52] hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Back to Instructor Profile
        </Link>

        <header>
          <h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">Edit Instructor</h1>
          <p className="mt-2 text-xs text-slate-500">Update {instructor.name}&apos;s profile, expertise, and availability.</p>
        </header>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Profile Information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Full Name
                <input name="name" defaultValue={instructor.name} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Specialty
                <input name="specialty" defaultValue={instructor.specialty} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Email Address
                <input name="email" defaultValue={instructor.email} type="email" className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Phone Number
                <input name="phone" defaultValue={instructor.phone} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Assignment Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Qualification
                <input name="qualification" defaultValue={instructor.qualification ?? ''} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">
                Status
                <select name="status" defaultValue={instructor.status} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52] sm:col-span-2">
                Location
                <input name="location" defaultValue={instructor.location} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
              <label className="block text-[10px] font-semibold text-[#1C1D52] sm:col-span-2">
                Short Bio
                <textarea name="bio" defaultValue={instructor.bio ?? ''} rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal outline-none focus:border-blue-400" />
              </label>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-6">
            <Link href={`/admin/student/instructors/${id}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1D52]">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] hover:bg-[#4aaa3e] disabled:cursor-not-allowed disabled:opacity-70">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  )
}

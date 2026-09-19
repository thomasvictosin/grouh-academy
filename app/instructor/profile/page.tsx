'use client'

import { Award, Check, Mail, MapPin, Save } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { InstructorPage } from '@/components/InstructorPage'

type InstructorProfile = {
  name: string
  email: string
  avatarUrl: string
  phone: string
  bio: string
  country: string
  state: string
  specialty: string
  qualification: string
  location: string
}

const emptyProfile: InstructorProfile = {
  name: '',
  email: '',
  avatarUrl: '',
  phone: '',
  bio: '',
  country: '',
  state: '',
  specialty: '',
  qualification: '',
  location: '',
}

export default function InstructorProfilePage() {
  const [profile, setProfile] = useState<InstructorProfile>(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/instructor/profile', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Profile unavailable')
        }

        const data = await response.json()
        setProfile({
          ...emptyProfile,
          ...data,
          location: data.location ?? [data.country, data.state].filter(Boolean).join(', '),
        })
      } catch (error) {
        console.error(error)
        setMessage('Your profile could not be loaded right now.')
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [])

  const initials = useMemo(() => {
    const displayName = profile.name || 'Instructor'
    return displayName
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0] ?? '')
      .join('')
      .toUpperCase()
  }, [profile.name])

  const updateProfile = (field: keyof InstructorProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }))
  }

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/instructor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          location: profile.location,
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to save profile')
      }

      setMessage('Profile updated successfully.')
    } catch (error) {
      console.error(error)
      setMessage(error instanceof Error ? error.message : 'Profile could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <InstructorPage
      title="Instructor Profile"
      description="Manage the professional profile learners see when they discover your courses."
    >
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#dceeff] text-xl font-bold text-[#1C1D52]">
            {initials}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1C1D52]">{profile.name || 'Instructor profile'}</h2>
            <p className="mt-1 text-xs text-slate-500">Instructor profile</p>
            <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {profile.email || 'your@email.com'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-sm text-slate-500">Loading profile...</div>
        ) : (
          <>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Field label="Display name" value={profile.name} onChange={(value) => updateProfile('name', value)} />
              <Field label="Specialty" value={profile.specialty} onChange={(value) => updateProfile('specialty', value)} />
              <Field label="Location" value={profile.location} onChange={(value) => updateProfile('location', value)} />
              <Field label="Qualification" value={profile.qualification} onChange={(value) => updateProfile('qualification', value)} />
            </div>

            <label className="mt-4 block text-xs font-bold text-[#1C1D52]">
              About you
              <textarea
                value={profile.bio}
                onChange={(event) => updateProfile('bio', event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-slate-200 p-3 text-xs font-normal outline-none focus:border-blue-400"
              />
            </label>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveProfile}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save profile'}
              </button>

              {message ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  <Check className="h-3.5 w-3.5 text-[#5FBB46]" />
                  {message}
                </span>
              ) : null}
            </div>
          </>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#dceeff] text-blue-600">
            <Award className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#1C1D52]">Teaching profile</h2>
            <p className="mt-1 text-[10px] text-slate-500">Students should recognize your expertise and learning outcomes.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            <span className="font-bold text-[#1C1D52]">Area of expertise:</span> {profile.specialty || 'Not specified yet'}
          </p>
          <p>
            <span className="font-bold text-[#1C1D52]">Qualification:</span> {profile.qualification || 'Not added yet'}
          </p>
          <p>
            <span className="font-bold text-[#1C1D52]">Location:</span> {profile.location || 'Remote'}
          </p>
        </div>
      </section>
    </InstructorPage>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block text-xs font-bold text-[#1C1D52]">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400"
      />
    </label>
  )
}

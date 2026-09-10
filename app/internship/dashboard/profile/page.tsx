'use client'

import { useState } from 'react'
import { BriefcaseBusiness, CalendarDays, Check, Edit3, MapPin, Phone, UserRound } from 'lucide-react'
import Image from 'next/image'
import InternshipShell from '@/components/InternshipShell'

const personalFields = [
  ['Full Name', 'Emmanuel Aster Seasoniker'],
  ['Email Address', 'emmanuel@grouh.com'],
  ['Phone Number', '+234 801 234 5678'],
  ['Date of Birth', 'October 14, 2001'],
  ['Gender', 'Male'],
  ['Location', 'Lagos, Nigeria'],
]

const internshipFields = [
  ['Program', 'Full Stack Development'],
  ['Department', 'Engineering'],
  ['Supervisor', 'Dr. Sarah Chen'],
  ['Start Date', 'March 1, 2024'],
  ['End Date', 'August 31, 2024'],
]

const skills = ['React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'Git']
const certifications = ['Backend Systems Mastery', 'Figma UI Advanced Workshop']

export default function InternshipProfilePage() {
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState('Active')

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="flex flex-col gap-5 rounded-2xl bg-[#5FBB46] p-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:flex-row sm:items-center sm:px-6 sm:py-6">
          <Image src="/avatar-placeholder.png" alt="Emmanuel Aster Seasoniker" width={84} height={84} className="h-20 w-20 rounded-full border-2 border-[#1C1D52] object-cover" />
          <div className="min-w-0 flex-1"><h1 className="text-xl font-bold sm:text-2xl">Emmanuel Aster Seasoniker</h1><p className="mt-1 text-xs">Software Engineering Intern</p><p className="mt-1 text-[10px] text-[#14204f]/65">Lagos, Nigeria</p></div>
          <button type="button" onClick={() => setEditing((current) => !current)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1D52] px-4 py-2.5 text-[10px] font-semibold text-white"><Edit3 className="h-3.5 w-3.5" />{editing ? 'Done Editing' : 'Edit Profile'}</button>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.95fr)]">
          <div className="space-y-5">
            <ProfileSection title="Personal Information" icon={<UserRound className="h-4 w-4" />}>
              <InfoList fields={personalFields} editing={editing} />
            </ProfileSection>
            <ProfileSection title="Internship Details" icon={<BriefcaseBusiness className="h-4 w-4" />}>
              <InfoList fields={internshipFields} editing={editing} />
              <div className="flex items-center justify-between border-b border-slate-200 py-2.5 text-[10px]"><span className="text-slate-500">Status</span><button type="button" onClick={() => setStatus(status === 'Active' ? 'On Hold' : 'Active')} className={`rounded-md px-3 py-1 font-semibold ${status === 'Active' ? 'bg-[#5FBB46] text-[#14204f]' : 'bg-amber-100 text-amber-700'}`}>{status}</button></div>
            </ProfileSection>
          </div>

          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Internship Progress</h2><div className="mt-4 flex justify-center"><div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#5FBB46 0 65%, #eaf1ff 65% 100%)' }}><div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-white"><strong className="text-2xl text-[#1C1D52]">65%</strong><span className="text-[9px] text-slate-500">Completed</span></div></div></div><div className="mt-4 grid grid-cols-2 divide-x border-t border-slate-200 pt-3 text-center"><div><span className="block text-[9px] text-slate-500">Remaining</span><strong className="mt-1 block text-xs text-[#1C1D52]">54 Days</strong></div><div><span className="block text-[9px] text-slate-500">Tasks Done</span><strong className="mt-1 block text-xs text-[#1C1D52]">32 / 48</strong></div></div></section>
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><h2 className="text-sm font-bold text-[#1C1D52]">Skills &amp; Expertise</h2><div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-md bg-[#eaf1ff] px-3 py-1.5 text-[9px] font-semibold text-[#1C1D52]">{skill}</span>)}</div><h3 className="mt-5 text-xs font-semibold text-slate-500">Certifications Earned</h3><div className="mt-3 space-y-2">{certifications.map((certification) => <p key={certification} className="flex items-center gap-2 text-[10px] text-[#1C1D52]"><Check className="h-3.5 w-3.5 text-[#5FBB46]" />{certification}</p>)}</div></section>
            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Contact Details</h2></div><p className="mt-3 flex items-center gap-2 text-[10px] text-slate-500"><Phone className="h-3 w-3" />+234 801 234 5678</p><p className="mt-2 flex items-center gap-2 text-[10px] text-slate-500"><CalendarDays className="h-3 w-3" />Available Monday - Friday</p></section>
          </div>
        </div>
      </div>
    </InternshipShell>
  )
}

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6"><div className="flex items-center justify-between border-b border-slate-200 pb-3"><h2 className="text-sm font-bold text-[#1C1D52]">{title}</h2><span className="text-blue-500">{icon}</span></div><div className="mt-3">{children}</div></section>
}

function InfoList({ fields, editing }: { fields: string[][]; editing: boolean }) {
  return <div>{fields.map(([label, value]) => <div key={label} className="flex flex-col gap-1 border-b border-slate-200 py-2.5 text-[10px] sm:flex-row sm:items-center sm:justify-between"><span className="text-slate-500">{label}</span>{editing ? <input defaultValue={value} aria-label={label} className="rounded border border-slate-200 px-2 py-1 text-right font-semibold text-[#1C1D52] outline-none focus:border-[#5FBB46]" /> : <strong className="text-[#1C1D52]">{value}</strong>}</div>)}</div>
}

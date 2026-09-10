'use client'

import { useState } from 'react'
import { Bell, LockKeyhole, Save, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'
import InternshipShell from '@/components/InternshipShell'

const panelClass = 'rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6'
const inputClass = 'mt-1.5 h-10 w-full rounded-lg bg-[#F3F6FB] px-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#5FBB46]' : 'bg-slate-300'}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} /></button>
}

export default function InternshipSettingsPage() {
  const [notifications, setNotifications] = useState({ messages: true, assignments: true, grades: true, meetings: false })
  const [profileVisible, setProfileVisible] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')
  const [theme, setTheme] = useState('Light')

  function saveProfile() {
    setSaveMessage('Profile settings saved')
    window.setTimeout(() => setSaveMessage(''), 2500)
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <InternshipShell>
      <div className="space-y-5">
        <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Intern Settings</h1><p className="mt-2 text-xs text-[#14204f]/75">Manage your internship profile, notifications, security, and workspace preferences.</p></section>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className={panelClass}><div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Profile Settings</h2></div><div className="mt-5 space-y-3"><label className="block text-[10px] font-semibold text-[#1C1D52]">Full Name<input className={inputClass} defaultValue="Emmanuel Aster Seasoniker" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Email Address<input className={inputClass} type="email" defaultValue="emmanuel@grouh.com" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Internship Role<input className={inputClass} defaultValue="Software Engineering Intern" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">About You<textarea className="mt-1.5 min-h-20 w-full resize-none rounded-lg bg-[#F3F6FB] px-3 py-2 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" defaultValue="Full Stack Development intern focused on building reliable products." /></label><div className="flex items-center gap-3"><button type="button" onClick={saveProfile} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#4aaa3e]"><Save className="h-3.5 w-3.5" />Save Changes</button>{saveMessage && <span className="text-[10px] font-semibold text-[#397d3a]">{saveMessage}</span>}</div></div></section>

          <div className="space-y-5"><section className={panelClass}><div className="flex items-center gap-2"><Bell className="h-4 w-4 text-[#5FBB46]" /><h2 className="text-sm font-bold text-[#1C1D52]">Notification Preferences</h2></div><div className="mt-4 divide-y divide-slate-200 border-t border-slate-200">{([['messages', 'Mentor and group messages'], ['assignments', 'Assignment reminders'], ['grades', 'Grade updates'], ['meetings', 'Meeting reminders']] as const).map(([key, label]) => <div key={key} className="flex items-center justify-between gap-4 py-3"><div><h3 className="text-[10px] font-semibold text-[#1C1D52]">{label}</h3><p className="mt-1 text-[9px] text-slate-500">Receive updates in your internship workspace.</p></div><Toggle checked={notifications[key]} onChange={() => toggleNotification(key)} /></div>)}</div></section><section className={panelClass}><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500" /><h2 className="text-sm font-bold text-[#1C1D52]">Privacy</h2></div><div className="mt-4 flex items-center justify-between gap-4"><div><h3 className="text-[10px] font-semibold text-[#1C1D52]">Profile visibility</h3><p className="mt-1 text-[9px] text-slate-500">Allow your cohort and mentor to view your progress.</p></div><Toggle checked={profileVisible} onChange={() => setProfileVisible(!profileVisible)} /></div></section></div>

          <section className={panelClass}><div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-[#f0a629]" /><h2 className="text-sm font-bold text-[#1C1D52]">Password &amp; Security</h2></div><div className="mt-5 space-y-3"><label className="block text-[10px] font-semibold text-[#1C1D52]">Current Password<input className={inputClass} type="password" placeholder="Enter current password" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">New Password<input className={inputClass} type="password" placeholder="Enter a new password" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Confirm New Password<input className={inputClass} type="password" placeholder="Confirm new password" /></label><button type="button" className="rounded-lg bg-[#1C1D52] px-4 py-2 text-[10px] font-semibold text-white hover:bg-[#292b6d]">Update Password</button></div></section>

          <section className={panelClass}><div className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4 text-[#5FBB46]" /><h2 className="text-sm font-bold text-[#1C1D52]">Workspace Preferences</h2></div><div className="mt-5 space-y-4"><div><p className="text-[10px] font-semibold text-[#1C1D52]">Theme</p><div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-[#F3F6FB] p-1"><button type="button" onClick={() => setTheme('Light')} className={`rounded-md py-2 text-[10px] ${theme === 'Light' ? 'bg-white font-semibold text-[#5FBB46] shadow-sm' : 'text-slate-500'}`}>Light</button><button type="button" onClick={() => setTheme('Dark')} className={`rounded-md py-2 text-[10px] ${theme === 'Dark' ? 'bg-[#1C1D52] font-semibold text-white shadow-sm' : 'text-slate-500'}`}>Dark</button></div></div><label className="block text-[10px] font-semibold text-[#1C1D52]">Timezone<select className={inputClass} defaultValue="WAT"><option value="WAT">GMT+1 (West Africa Time)</option><option value="GMT">GMT</option><option value="EST">GMT-5 (Eastern Time)</option></select></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Language<select className={inputClass} defaultValue="English"><option>English</option><option>French</option><option>Portuguese</option></select></label></div></section>
        </div>
      </div>
    </InternshipShell>
  )
}

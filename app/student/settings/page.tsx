'use client'

import { useState } from 'react'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#5FBB46]' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-[left] ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

const inputClass = 'mt-1.5 h-10 w-full rounded-lg bg-[#F3F6FB] px-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25'
const panelClass = 'rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6'

export default function SettingsPage() {
  const [privacyVisible, setPrivacyVisible] = useState(true)
  const [learningStats, setLearningStats] = useState(false)
  const [notifications, setNotifications] = useState([true, true, true, false, true, false])
  const [theme, setTheme] = useState('Light Theme')

  const toggleNotification = (index: number) => {
    setNotifications((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings &amp; Preferences</h1>
        <p className="mt-2 text-xs text-[#14204f]/75">Customize your profile details, secure your credentials, and select notification settings to align with your learning rhythm.</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={panelClass}>
          <h2 className="text-sm font-bold text-[#1C1D52]">Profile Settings</h2>
          <div className="mx-auto mt-6 max-w-md space-y-3">
            <div className="flex justify-center"><button type="button" className="rounded-md bg-[#e8f7eb] px-3 py-2 text-[10px] font-semibold text-[#5FBB46]">Change Photo</button></div>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Full Name<input className={inputClass} defaultValue="Emmanuel Aster" /></label>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Email Address<input className={inputClass} type="email" defaultValue="emmanuel.aster@email.com" /></label>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Phone Number<input className={inputClass} defaultValue="+234 801 234 5678" /></label>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Bio / About<textarea className="mt-1.5 min-h-14 w-full resize-none rounded-lg bg-[#F3F6FB] px-3 py-2 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" defaultValue="Full Stack Development intern at TechBridge Academy" /></label>
            <button type="button" className="rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#4aaa3e]">Save Changes</button>
          </div>
        </section>

        <div className="space-y-5">
          <section className={panelClass}>
            <h2 className="text-sm font-bold text-[#1C1D52]">Privacy Settings</h2>
            <div className="mt-3 divide-y divide-slate-200 border-t border-slate-300">
              <div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 py-3"><div className="min-w-0"><h3 className="text-[10px] font-bold text-[#1C1D52]">Profile Visibility</h3><p className="mt-1 text-[9px] text-slate-500">Allow classmates and recruiters to view your certificates and progress.</p></div><Toggle checked={privacyVisible} onChange={() => setPrivacyVisible(!privacyVisible)} /></div>
              <div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 py-3"><div className="min-w-0"><h3 className="text-[10px] font-bold text-[#1C1D52]">Show Learning Statistics to Others</h3><p className="mt-1 text-[9px] text-slate-500">Let other classmates see your daily average hours spent.</p></div><Toggle checked={learningStats} onChange={() => setLearningStats(!learningStats)} /></div>
            </div>
          </section>

          <section className={panelClass}>
            <h2 className="text-sm font-bold text-[#1C1D52]">Password Security</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Current Password<input className={inputClass} type="password" defaultValue="password123" /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">New Password<input className={inputClass} type="password" defaultValue="password123" /></label>
              <label className="block text-[10px] font-semibold text-[#1C1D52]">Confirm Password<input className={inputClass} type="password" defaultValue="password123" /></label>
              <button type="button" className="rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-semibold text-white transition hover:bg-[#4aaa3e]">Update Password</button>
            </div>
          </section>
        </div>

        <section className={panelClass}>
          <h2 className="text-sm font-bold text-[#1C1D52]">Notification Preferences</h2>
          <div className="mt-4 space-y-3">
            {['Email Notifications', 'Push Notifications', 'Course Updates', 'Assignment Reminders', 'Grade Notifications', 'Mentorship Messages'].map((label, index) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4"><span className="min-w-0 text-[10px] text-[#1C1D52]">{label}</span><Toggle checked={notifications[index]} onChange={() => toggleNotification(index)} /></div>)}
          </div>
        </section>

        <section className={panelClass}>
          <h2 className="text-sm font-bold text-[#1C1D52]">Appearance &amp; Localization</h2>
          <div className="mt-4 space-y-4">
            <div><p className="text-[10px] font-semibold text-[#1C1D52]">Theme Mode</p><div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-[#F3F6FB] p-1"><button type="button" onClick={() => setTheme('Light Theme')} className={`rounded-md py-2 text-[10px] ${theme === 'Light Theme' ? 'bg-white font-semibold text-[#5FBB46] shadow-sm' : 'text-slate-500'}`}>Light Theme</button><button type="button" onClick={() => setTheme('Dark Theme')} className={`rounded-md py-2 text-[10px] ${theme === 'Dark Theme' ? 'bg-[#1C1D52] font-semibold text-white shadow-sm' : 'text-slate-500'}`}>Dark Theme</button></div></div>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Default Language<select className={inputClass} defaultValue="English (US)"><option>English (US)</option><option>French</option><option>Portuguese</option></select></label>
            <label className="block text-[10px] font-semibold text-[#1C1D52]">Account Timezone<select className={inputClass} defaultValue="GMT+1 (West Africa Time)"><option>GMT+1 (West Africa Time)</option><option>GMT</option><option>GMT-5 (Eastern Time)</option></select></label>
          </div>
        </section>
      </div>
    </div>
  )
}

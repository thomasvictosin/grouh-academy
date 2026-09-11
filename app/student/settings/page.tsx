'use client'

import { Check, Eye, EyeOff, ImagePlus, Lock, Moon, Save, Sun } from 'lucide-react'
import { useRef, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={onChange} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-[#5FBB46]' : 'bg-slate-300'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-[left] ${checked ? 'left-6' : 'left-1'}`} /></button>
}

const inputClass = 'mt-1.5 h-10 w-full rounded-lg bg-[#F3F6FB] px-3 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25'
const panelClass = 'rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6'

export default function SettingsPage() {
  const [privacyVisible, setPrivacyVisible] = useState(true)
  const [learningStats, setLearningStats] = useState(false)
  const [notifications, setNotifications] = useState([true, true, true, false, true, false])
  const [theme, setTheme] = useState<'Light Theme' | 'Dark Theme'>('Light Theme')
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false })
  const [saved, setSaved] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [photo, setPhoto] = useState('/avatar-placeholder.png')
  const fileRef = useRef<HTMLInputElement>(null)

  const toggleNotification = (index: number) => setNotifications((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))
  const show = (key: keyof typeof showPasswords) => setShowPasswords((current) => ({ ...current, [key]: !current[key] }))
  const saveChanges = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaved(true); window.setTimeout(() => setSaved(false), 2500) }
  const choosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }
  const updatePassword = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const form = event.currentTarget.closest('form')
    const newPassword = form?.querySelector<HTMLInputElement>('input[name="new-password"]')?.value ?? ''
    const confirmation = form?.querySelector<HTMLInputElement>('input[name="confirm-password"]')?.value ?? ''
    setPasswordMessage(null)
    if (newPassword.length < 8 || newPassword !== confirmation) {
      setPasswordMessage(newPassword.length < 8 ? 'Use at least 8 characters.' : 'New passwords do not match.')
      return
    }
    const { error } = await createSupabaseBrowserClient().auth.updateUser({ password: newPassword })
    setPasswordMessage(error ? error.message : 'Password updated successfully.')
  }

  return <div className={`space-y-5 ${theme === 'Dark Theme' ? 'rounded-2xl bg-[#11152f] p-3 text-white sm:p-5' : ''}`}>
    <section className="rounded-2xl bg-[#5FBB46] px-6 py-5 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-6"><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings &amp; Preferences</h1><p className="mt-2 text-xs text-[#14204f]/75">Customize your profile details, security, notifications, and appearance.</p></section>
    <form onSubmit={saveChanges} className="grid gap-5 lg:grid-cols-2">
      <section className={panelClass}><h2 className="text-sm font-bold text-[#1C1D52]">Profile Settings</h2><div className="mx-auto mt-6 max-w-md space-y-3"><div className="flex items-center gap-4"><img src={photo} alt="Profile" className="h-16 w-16 rounded-full object-cover" /><input ref={fileRef} type="file" accept="image/*" onChange={choosePhoto} className="hidden" /><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-md bg-[#e8f7eb] px-3 py-2 text-[10px] font-semibold text-[#397d3a]"><ImagePlus className="h-3.5 w-3.5" />Change Photo</button></div><label className="block text-[10px] font-semibold text-[#1C1D52]">Full Name<input className={inputClass} defaultValue="Emmanuel Aster" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Email Address<input className={inputClass} type="email" defaultValue="emmanuel.aster@email.com" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Phone Number<input className={inputClass} defaultValue="+234 801 234 5678" /></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Bio / About<textarea className="mt-1.5 min-h-14 w-full resize-none rounded-lg bg-[#F3F6FB] px-3 py-2 text-xs text-[#1C1D52] outline-none focus:ring-2 focus:ring-[#5FBB46]/25" defaultValue="Full Stack Development intern at TechBridge Academy" /></label></div></section>
      <div className="space-y-5"><section className={panelClass}><h2 className="text-sm font-bold text-[#1C1D52]">Privacy Settings</h2><div className="mt-3 divide-y divide-slate-200 border-t border-slate-300"><div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 py-3"><div><h3 className="text-[10px] font-bold text-[#1C1D52]">Profile Visibility</h3><p className="mt-1 text-[9px] text-slate-500">Allow classmates and recruiters to view your progress.</p></div><Toggle checked={privacyVisible} onChange={() => setPrivacyVisible(!privacyVisible)} /></div><div className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 py-3"><div><h3 className="text-[10px] font-bold text-[#1C1D52]">Show Learning Statistics</h3><p className="mt-1 text-[9px] text-slate-500">Let classmates see your learning activity.</p></div><Toggle checked={learningStats} onChange={() => setLearningStats(!learningStats)} /></div></div></section><section className={panelClass}><h2 className="text-sm font-bold text-[#1C1D52]">Password Security</h2><div className="mt-4 space-y-3">{([['current', 'Current Password', 'password123', 'current-password'], ['next', 'New Password', '', 'new-password'], ['confirm', 'Confirm Password', '', 'confirm-password']] as const).map(([key, label, value, name]) => <label key={key} className="block text-[10px] font-semibold text-[#1C1D52]">{label}<span className="relative block"><input name={name} className={`${inputClass} pr-10`} type={showPasswords[key] ? 'text' : 'password'} defaultValue={value} minLength={8} /><button type="button" onClick={() => show(key)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPasswords[key] ? `Hide ${label}` : `Show ${label}`}>{showPasswords[key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>)}<button type="button" onClick={updatePassword} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2 text-[10px] font-semibold text-white"><Lock className="h-3.5 w-3.5" />Update Password</button>{passwordMessage && <p className="text-[10px] font-semibold text-[#397d3a]" role="status">{passwordMessage}</p>}</div></section></div>
  <section className={panelClass}><h2 className="text-sm font-bold text-[#1C1D52]">Notification Preferences</h2><div className="mt-4 space-y-3">{['Email Notifications', 'Push Notifications', 'Course Updates', 'Assignment Reminders', 'Grade Notifications', 'Mentorship Messages'].map((label, index) => <div key={label} className="grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4"><span className="min-w-0 text-[10px] text-[#1C1D52]">{label}</span><Toggle checked={notifications[index]} onChange={() => toggleNotification(index)} /></div>)}</div></section>
  <section className={panelClass}><h2 className="text-sm font-bold text-[#1C1D52]">Appearance &amp; Localization</h2><div className="mt-4 space-y-4"><div><p className="text-[10px] font-semibold text-[#1C1D52]">Theme Mode</p><div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-[#F3F6FB] p-1"><button type="button" onClick={() => setTheme('Light Theme')} className={`inline-flex items-center justify-center gap-2 rounded-md py-2 text-[10px] ${theme === 'Light Theme' ? 'bg-white font-semibold text-[#5FBB46] shadow-sm' : 'text-slate-500'}`}><Sun className="h-3.5 w-3.5" />Light Theme</button><button type="button" onClick={() => setTheme('Dark Theme')} className={`inline-flex items-center justify-center gap-2 rounded-md py-2 text-[10px] ${theme === 'Dark Theme' ? 'bg-[#1C1D52] font-semibold text-white shadow-sm' : 'text-slate-500'}`}><Moon className="h-3.5 w-3.5" />Dark Theme</button></div></div><label className="block text-[10px] font-semibold text-[#1C1D52]">Default Language<select className={inputClass} defaultValue="English (US)"><option>English (US)</option><option>French</option><option>Portuguese</option></select></label><label className="block text-[10px] font-semibold text-[#1C1D52]">Account Timezone<select className={inputClass} defaultValue="GMT+1 (West Africa Time)"><option>GMT+1 (West Africa Time)</option><option>GMT</option><option>GMT-5 (Eastern Time)</option></select></label></div></section>
  <div className="flex items-center gap-3 lg:col-span-2"><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]"><Save className="h-4 w-4" />Save Changes</button>{saved && <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#397d3a]" role="status"><Check className="h-4 w-4" />Settings saved</span>}</div>
    </form>
  </div>
}

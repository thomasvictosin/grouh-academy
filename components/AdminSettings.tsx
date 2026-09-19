'use client'

import { Award, Bell, Palette, Save, Settings } from 'lucide-react'
import Link from 'next/link'

export type SettingsSection = 'general' | 'branding' | 'certificate-settings' | 'notifications'

const sections: { label: string; href: string; icon: typeof Settings; key: SettingsSection }[] = [
  { label: 'General', href: '/admin/student/settings', icon: Settings, key: 'general' },
  { label: 'Branding', href: '/admin/student/settings/branding', icon: Palette, key: 'branding' },
  { label: 'Certificate Settings', href: '/admin/student/settings/certificate-settings', icon: Award, key: 'certificate-settings' },
  { label: 'Notifications', href: '/admin/student/settings/notifications', icon: Bell, key: 'notifications' },
]

export default function AdminSettings({ active, children, title, description }: { active: SettingsSection; children: React.ReactNode; title: string; description?: string }) {
  return <div className="mx-auto max-w-[1400px] space-y-5"><header><h1 className="text-2xl font-semibold text-[#1C1D52] sm:text-3xl">LMS Global Settings</h1><p className="mt-2 text-xs text-slate-500">Configure workspace defaults, verification mechanisms, payment gateways, and system parameters.</p></header><div className="grid gap-5 lg:grid-cols-[195px_minmax(0,1fr)]"><nav aria-label="Settings navigation" className="h-fit rounded-2xl bg-white p-2 shadow-[0_7px_20px_rgba(28,29,82,0.08)] lg:p-3">{sections.map(({ label, href, icon: Icon, key }) => <Link key={key} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[11px] font-semibold ${active === key ? 'bg-[#e8f0ff] text-[#1C1D52]' : 'text-[#1C1D52] hover:bg-slate-50'}`}><Icon className="h-4 w-4 shrink-0" />{label}</Link>)}</nav><main className="rounded-2xl bg-white p-5 shadow-[0_7px_20px_rgba(28,29,82,0.08)] sm:p-7"><div className="border-b border-slate-200 pb-5"><h2 className="text-lg font-bold text-[#1C1D52]">{title}</h2>{description && <p className="mt-2 text-xs text-slate-500">{description}</p>}</div>{children}</main></div></div>
}

export function SettingsField({ label, name, defaultValue, type = 'text', placeholder, disabled }: { label: string; name?: string; defaultValue?: string; type?: string; placeholder?: string; disabled?: boolean }) {
  return <label className="block text-[10px] font-semibold text-[#1C1D52]">{label}<input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-xs font-normal outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400" /></label>
}

export function SettingsSelect({ label, name, defaultValue, options }: { label: string; name?: string; defaultValue: string; options: string[] }) {
  return <label className="block text-[10px] font-semibold text-[#1C1D52]">{label}<select name={name} defaultValue={defaultValue} className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-normal outline-none focus:border-blue-400">{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

export function SettingsToggle({ label, name, description, defaultChecked = false }: { label: string; name?: string; description?: string; defaultChecked?: boolean }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 py-2"><span><span className="block text-xs font-semibold text-[#1C1D52]">{label}</span>{description && <span className="mt-1 block text-[10px] text-slate-500">{description}</span>}</span><span className="relative shrink-0"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" /><span className="block h-5 w-8 rounded-full bg-slate-300 transition peer-checked:bg-[#5FBB46]" /><span className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition peer-checked:translate-x-3" /></span></label>
}

export function SettingsActions({ saving, savedMessage }: { saving?: boolean; savedMessage?: string } = {}) {
  return (
    <div className="mt-7 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
      {savedMessage && <span className="text-xs font-semibold text-[#397d3a]">{savedMessage}</span>}
      <button type="reset" disabled={saving} className="rounded-lg px-4 py-2.5 text-xs font-semibold text-slate-500 shadow-[inset_0_0_0_1px_#d8dee8] disabled:opacity-50">Reset</button>
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f] disabled:opacity-60">
        <Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

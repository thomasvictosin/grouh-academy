import AdminShell from '@/components/AdminShell'
import AdminSettings, { SettingsActions, SettingsField, SettingsSelect } from '@/components/AdminSettings'

export default function BrandingSettingsPage() {
  return <AdminShell workspace="student"><AdminSettings active="branding" title="Branding & Appearance" description="Control the visual identity shown throughout the learning platform."><form className="pt-5"><div className="grid gap-4 sm:grid-cols-2"><SettingsField label="Academy Name" defaultValue="Grouh Academy" /><SettingsField label="Support Email" defaultValue="support@grouh.com" type="email" /><SettingsField label="Primary Color" defaultValue="#5FBB46" /><SettingsField label="Accent Color" defaultValue="#1C1D52" /></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><SettingsSelect label="Font Family" defaultValue="Geist Sans" options={['Geist Sans', 'Inter', 'Plus Jakarta Sans']} /><SettingsSelect label="Logo Placement" defaultValue="Header and Login" options={['Header and Login', 'Header only', 'Login only']} /></div><SettingsActions /></form></AdminSettings></AdminShell>
}

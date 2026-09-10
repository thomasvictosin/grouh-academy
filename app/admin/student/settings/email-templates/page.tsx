import AdminShell from '@/components/AdminShell'
import AdminSettings, { SettingsActions, SettingsField, SettingsSelect } from '@/components/AdminSettings'

export default function EmailTemplatesSettingsPage() {
  return <AdminShell workspace="student"><AdminSettings active="email-templates" title="Email Templates" description="Manage the messages sent automatically to students and instructors."><form className="space-y-5 pt-5"><SettingsSelect label="Template to Edit" defaultValue="Welcome Email" options={['Welcome Email', 'Email Verification', 'Password Reset', 'Course Enrollment', 'Certificate Issued']} /><SettingsField label="Email Subject" defaultValue="Welcome to Grouh Academy" /><label className="block text-[10px] font-semibold text-[#1C1D52]">Email Content<textarea rows={9} defaultValue={'Hi {{student_name}},\n\nWelcome to Grouh Academy. Your learning journey starts here.'} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-normal outline-none focus:border-blue-400" /></label><SettingsActions /></form></AdminSettings></AdminShell>
}

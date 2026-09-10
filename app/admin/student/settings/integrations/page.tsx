import AdminShell from '@/components/AdminShell'
import AdminSettings, { SettingsActions, SettingsField, SettingsToggle } from '@/components/AdminSettings'

export default function IntegrationSettingsPage() {
  return <AdminShell workspace="student"><AdminSettings active="integrations" title="Integrations" description="Connect the tools your academy uses to communicate, measure, and operate."><form className="pt-5"><div className="space-y-4"><Integration name="Google Analytics" description="Measure traffic and learning engagement across the platform." defaultChecked /><Integration name="Mailchimp" description="Sync student contacts and send marketing campaigns." /><Integration name="Slack" description="Send operational alerts to your team workspace." defaultChecked /></div><div className="mt-7 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2"><SettingsField label="Google Analytics Measurement ID" defaultValue="G-ABC1234567" /><SettingsField label="Webhook URL" placeholder="https://example.com/webhook" /></div><SettingsActions /></form></AdminSettings></AdminShell>
}

function Integration({ name, description, defaultChecked = false }: { name: string; description: string; defaultChecked?: boolean }) {
  return <div className="rounded-xl border border-slate-200 p-4"><SettingsToggle label={name} description={description} defaultChecked={defaultChecked} /></div>
}

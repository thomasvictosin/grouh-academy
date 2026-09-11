import MfaSettings from '@/components/MfaSettings'

export default function MfaSetupPage() {
  return <main className="min-h-screen bg-slate-100 px-6 py-12"><section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8"><img src="/logo.png" alt="Grouh Academy logo" className="h-10 w-auto" /><h1 className="mt-8 text-3xl font-bold text-[#1c1d52]">Account security</h1><p className="mt-3 text-sm leading-6 text-slate-500">Set up Google Authenticator to add a second verification step to your account.</p><MfaSettings /></section></main>
}
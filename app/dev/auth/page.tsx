import { notFound } from 'next/navigation'

import { DEVELOPMENT_TEST_ROLES, getDevelopmentAuthRole, isDevelopmentBypassEnabled } from '@/lib/dev-auth'

export default async function DevelopmentAuthPage() {
  if (!isDevelopmentBypassEnabled()) {
    notFound()
  }

  const currentRole = await getDevelopmentAuthRole()

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-[#17251c]">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-[0_24px_70px_rgba(28,29,82,0.16)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5FBB46]">Development mode</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1c1d52]">Choose a test workspace</h1>

        {currentRole ? (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Active development session: <span className="font-bold">{currentRole}</span>
          </p>
        ) : null}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {DEVELOPMENT_TEST_ROLES.map((role) => (
            <form key={role} action="/api/dev/auth" method="POST">
              <input type="hidden" name="role" value={role} />
              <button
                type="submit"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-[#1c1d52] transition hover:border-[#5FBB46] hover:bg-[#f3fbf0]"
              >
                {role}
              </button>
            </form>
          ))}
        </div>

        {currentRole ? (
          <form action="/api/dev/auth" method="POST" className="mt-8">
            <input type="hidden" name="action" value="clear" />
            <button
              type="submit"
              className="w-full rounded-xl bg-[#1c1d52] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2b68]"
            >
              Exit Development Session
            </button>
          </form>
        ) : null}
      </div>
    </main>
  )
}

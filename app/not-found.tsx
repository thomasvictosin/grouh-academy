import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#f8f9fb] px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-8 text-center shadow-xl shadow-grey-200 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5FBB46]">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#1C1D52] sm:text-5xl">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
          The page you were looking for doesn’t exist or may have moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1C1D52] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2a2d6e]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <Link
            href="/student"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-[#1C1D52] transition hover:bg-slate-50"
          >
            Student dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}

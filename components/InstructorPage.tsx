import Link from 'next/link'

export function InstructorPage({ title, description, action, children }: { title: string; description: string; action?: { label: string; href: string }; children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1180px] space-y-5"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#5FBB46]">Instructor workspace</p><h1 className="mt-2 text-2xl font-bold text-[#1C1D52] sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">{description}</p></div>{action && <Link href={action.href} className="inline-flex w-fit items-center justify-center rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-bold text-[#14204f]">{action.label}</Link>}</header>{children}</div>
}

export function InstructorStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)]"><span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</span><strong className="mt-3 block text-2xl font-bold text-[#1C1D52]">{value}</strong><span className="mt-1 block text-[10px] text-[#5FBB46]">{detail}</span></div>
}

export function StatusBadge({ children, tone = 'green' }: { children: React.ReactNode; tone?: 'green' | 'amber' | 'blue' }) {
  const styles = { green: 'bg-[#e8f7eb] text-[#397d3a]', amber: 'bg-amber-50 text-amber-700', blue: 'bg-blue-50 text-blue-700' }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[tone]}`}>{children}</span>
}

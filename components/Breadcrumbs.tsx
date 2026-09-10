import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type BreadcrumbsProps = {
  current: string
  dark?: boolean
}

export default function Breadcrumbs({ current, dark = false }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${dark ? 'text-white/45' : 'text-slate-500'}`}>
      <Link href="/" className={`transition-colors ${dark ? 'hover:text-white' : 'hover:text-[#141650]'}`}>
        Home
      </Link>
      <ChevronRight className="h-4 w-4" aria-hidden="true" />
      <span className={dark ? 'text-[#8edb70]' : 'font-semibold text-[#141650]'} aria-current="page">
        {current}
      </span>
    </nav>
  )
}

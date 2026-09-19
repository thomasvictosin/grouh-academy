'use client'

import { ArrowLeft, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import AdminShell from '@/components/AdminShell'

export default function CertificateEditPage() {
  const { slug } = useParams<{ slug: string }>()
  return <AdminShell workspace="student"><div className="mx-auto max-w-[720px] space-y-5"><Link href={`/admin/student/certificates/${slug}`} className="inline-flex items-center gap-2 text-xs font-semibold text-[#1C1D52]"><ArrowLeft className="h-4 w-4" />Back to certificate</Link><section className="rounded-2xl bg-white p-6 shadow-[0_7px_20px_rgba(28,29,82,0.08)]"><ShieldCheck className="h-8 w-8 text-[#5FBB46]" /><h1 className="mt-4 text-2xl font-semibold text-[#1C1D52]">Certificate records are immutable</h1><p className="mt-3 text-sm leading-6 text-slate-600">Learner, course, certificate number, and issue date are captured from the completed enrollment to preserve verification integrity. Revoke an incorrect certificate from the registry, then issue the correct record after the enrollment is fixed.</p><Link href="/admin/student/certificates" className="mt-6 inline-flex rounded-lg bg-[#5FBB46] px-4 py-2.5 text-xs font-semibold text-[#14204f]">Open certificate registry</Link></section></div></AdminShell>
}

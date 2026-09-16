'use client'

import Image from 'next/image'
import { Award, Download, Eye, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Certificate = {
  id: string
  certificateNumber: string
  verificationId: string
  courseTitle: string
  courseSlug: string
  studentName: string
  issuedAt: string
}

// A certificate is always laid out at these exact pixel dimensions -
// Letter landscape at 96dpi (11in x 8.5in). This never changes based on
// viewport. On screen, ScaledCertificate shrinks the whole thing down
// proportionally with a CSS transform so it fits small devices without
// altering its internal layout. When printed/downloaded, the print
// stylesheet below removes that scaling and pins the page itself to the
// same physical size, so the PDF a phone produces and the PDF a desktop
// produces are identical.
const CERT_WIDTH = 1056
const CERT_HEIGHT = 816

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function CertificateFace({ certificate }: { certificate: Certificate }) {
  return (
    <div
      className="certificate-print relative overflow-hidden border-[10px] border-[#1C1D52] bg-white text-[#1C1D52] shadow-xl"
      style={{ width: CERT_WIDTH, height: CERT_HEIGHT }}
    >
      <div className="absolute inset-5 border-2 border-[#f3b619]" />
      <div className="relative flex h-full flex-col justify-between border border-[#d9b443]/50 p-10 text-center">
        <div>
          <Image src="/logo.png" alt="Grouh Academy" width={170} height={45} className="mx-auto h-auto w-44" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.32em] text-[#5FBB46]">Official certification</p>
          <h2 className="mt-8 font-serif text-5xl font-semibold">Certificate of Completion</h2>
          <p className="mt-8 text-sm text-slate-500">This certificate is proudly presented to</p>
          <h3 className="mt-4 inline-block border-b-2 border-[#f3b619] px-6 pb-3 font-serif text-4xl font-semibold">
            {certificate.studentName}
          </h3>
          <p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-slate-500">
            For successfully completing the advanced industry certification curriculum and demonstrating mastery of professional standards in
          </p>
          <p className="mt-5 text-2xl font-bold text-[#5FBB46]">{certificate.courseTitle}</p>
          <p className="mt-4 text-sm text-slate-500">Completed on {formatDate(certificate.issuedAt)}</p>
        </div>
        <div className="grid grid-cols-3 items-end gap-5 text-left text-[9px] text-slate-500">
          <div>
            <p className="font-serif text-base text-[#1C1D52]">Emmanuel Thomas</p>
            <div className="mt-1 border-t border-slate-300 pt-1 uppercase tracking-wider">Academy Director</div>
          </div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#f3b619] bg-[#ffc32b] text-xl text-white">★</div>
          <div className="text-right">
            Certificate No: <strong>{certificate.certificateNumber}</strong>
            <br />
            Verification ID: <strong>{certificate.verificationId}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

// Shrinks the fixed-size certificate to fit whatever width its container
// has, without changing the certificate's own internal layout - the
// certificate is always rendered at full CERT_WIDTH x CERT_HEIGHT and
// scaled as a whole via CSS transform, so nothing inside it ever
// reflows differently on a phone vs. a desktop.
function ScaledCertificate({ certificate }: { certificate: Certificate }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateScale = () => {
      const availableWidth = container.clientWidth
      setScale(Math.min(1, availableWidth / CERT_WIDTH))
    }

    updateScale()

    const observer = new ResizeObserver(updateScale)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ height: CERT_HEIGHT * scale }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: CERT_WIDTH, height: CERT_HEIGHT }}>
        <CertificateFace certificate={certificate} />
      </div>
    </div>
  )
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Certificate | null>(null)
  const [online, setOnline] = useState(false)

  useEffect(() => {
    fetch('/api/student/certificates')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load your certificates.')
        return response.json() as Promise<Certificate[]>
      })
      .then((data) => {
        setCertificates(data)
        setSelected(data[0] ?? null)
      })
      .catch((requestError: unknown) =>
        setError(requestError instanceof Error ? requestError.message : 'Unable to load your certificates.'),
      )
      .finally(() => setLoading(false))
  }, [])

  const downloadCertificate = (certificate: Certificate) => {
    setSelected(certificate)
    window.setTimeout(() => window.print(), 0)
  }

  return (
    <div className="space-y-6">
      {/*
        Print isolation + fixed physical page size. `.certificate-print`
        is always rendered at CERT_WIDTH x CERT_HEIGHT (see CertificateFace)
        regardless of viewport; on print we cancel the on-screen scaling
        transform and pin the page itself to the same 11in x 8.5in size,
        so the resulting PDF is identical no matter what device produced
        it.
      */}
      <style>{`
        @media print {
          @page {
            size: 11in 8.5in landscape;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .certificate-print,
          .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: fixed !important;
            top: 0;
            left: 0;
            width: 11in !important;
            height: 8.5in !important;
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <section className="rounded-2xl bg-[#5FBB46] px-6 py-6 text-[#14204f] shadow-[0_12px_28px_rgba(95,187,70,0.18)] sm:px-8 sm:py-7">
        <h1 className="text-3xl font-bold tracking-tight">Certificate System</h1>
        <p className="mt-2 max-w-3xl text-sm leading-5 text-[#14204f]/75">
          Your official credentials are ready to view online and print as polished PDF certificates.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">{error}</div>
      )}

      {!error && loading && (
        <div className="h-[400px] animate-pulse rounded-2xl bg-white shadow-[0_8px_24px_rgba(28,29,82,0.09)]" />
      )}

      {!error && !loading && certificates.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Award className="mx-auto h-8 w-8 text-slate-300" />
          <h2 className="mt-4 text-lg font-bold text-[#1C1D52]">No certificates yet</h2>
          <p className="mt-2 text-sm text-slate-500">Complete a course to earn your first certificate - it'll show up here automatically.</p>
        </div>
      )}

      {!error && !loading && selected && (
        <>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#1C1D52]">Currently Selected Certificate</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOnline(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#1C1D52] px-3 py-2 text-[10px] font-bold text-[#1C1D52]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Online
                </button>
                <button
                  type="button"
                  onClick={() => downloadCertificate(selected)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1C1D52] px-3 py-2 text-[10px] font-bold text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </button>
              </div>
            </div>
            <ScaledCertificate certificate={selected} />
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.09)] sm:p-6">
            <h2 className="text-sm font-bold text-[#1C1D52]">Your Earned Credentials</h2>
            <div className="mt-4 space-y-2">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="flex flex-col gap-3 rounded-xl bg-[#fbfcff] p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="text-xs font-bold text-[#1C1D52]">{certificate.courseTitle}</h3>
                    <p className="mt-1 text-[9px] text-slate-500">
                      Completed on {formatDate(certificate.issuedAt)} · ID: {certificate.certificateNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(certificate)
                        setOnline(true)
                      }}
                      className="rounded-lg bg-white px-3 py-2 text-[10px] font-semibold text-[#1C1D52] shadow-[inset_0_0_0_1px_#1C1D52]"
                    >
                      View Online
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadCertificate(certificate)}
                      className="rounded-lg bg-[#1C1D52] px-3 py-2 text-[10px] font-semibold text-white"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {online && selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1D52]/70 p-4 sm:p-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setOnline(false)}
                className="rounded-full bg-white p-2 text-[#1C1D52]"
                aria-label="Close certificate preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ScaledCertificate certificate={selected} />
          </div>
        </div>
      )}
    </div>
  )
}
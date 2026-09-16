import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'
import type { StudentCertificate } from '@/lib/certificates'

export async function GET() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true } },
      user: { select: { name: true, profile: { select: { firstName: true, lastName: true } } } },
    },
    orderBy: { issuedAt: 'desc' },
  })

  const response: StudentCertificate[] = certificates.map((certificate) => {
    const fullName = [certificate.user.profile?.firstName, certificate.user.profile?.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()

    return {
      id: certificate.id,
      certificateNumber: certificate.certificateNumber,
      // Derived from the certificate's own id rather than stored
      // separately - there's no dedicated verification-id field on the
      // Certificate model, and the id itself is already a unique,
      // unguessable identifier suitable for a lightweight display code.
      verificationId: `VR-${certificate.id.slice(-8).toUpperCase()}`,
      courseTitle: certificate.course.title,
      courseSlug: certificate.course.slug,
      studentName: fullName || certificate.user.name || 'Student',
      issuedAt: certificate.issuedAt.toISOString(),
    }
  })

  return NextResponse.json(response)
}
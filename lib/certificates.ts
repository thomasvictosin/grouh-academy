import type { CourseDb } from '@/lib/course-data'

export type StudentCertificate = {
  id: string
  certificateNumber: string
  verificationId: string
  courseTitle: string
  courseSlug: string
  studentName: string
  issuedAt: string
}

async function nextCertificateNumber(db: CourseDb): Promise<string> {
  const year = new Date().getUTCFullYear()
  const yearStart = new Date(Date.UTC(year, 0, 1))
  const yearEnd = new Date(Date.UTC(year + 1, 0, 1))

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const count = await db.certificate.count({
      where: { issuedAt: { gte: yearStart, lt: yearEnd } },
    })

    const candidate = `${year}-${String(count + 1 + attempt).padStart(5, '0')}`
    const existing = await db.certificate.findUnique({ where: { certificateNumber: candidate } })

    if (!existing) {
      return candidate
    }
  }

  // Sequential numbering collided repeatedly (e.g. concurrent
  // completions racing for the same count). Fall back to something
  // effectively guaranteed unique rather than looping forever.
  return `${year}-${Date.now().toString(36).toUpperCase()}`
}

/**
 * Issues a certificate for a completed course, or returns the existing
 * one if it was already issued. Safe to call every time an enrollment
 * transitions to COMPLETED - relies on the Certificate.userId_courseId
 * unique constraint (see SCHEMA_MIGRATION_INSTRUCTIONS.txt) so a
 * student toggling a lesson complete/incomplete/complete again never
 * produces more than one certificate for the same course.
 */
export async function ensureCertificateIssued(
  db: CourseDb,
  { userId, courseId, enrollmentId }: { userId: string; courseId: string; enrollmentId: string },
) {
  const existing = await db.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  })

  if (existing) {
    return existing
  }

  const certificateNumber = await nextCertificateNumber(db)

  return db.certificate.upsert({
    where: { userId_courseId: { userId, courseId } },
    update: {},
    create: { userId, courseId, enrollmentId, certificateNumber },
  })
}
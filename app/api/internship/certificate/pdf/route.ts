import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { getCurrentUserId } from '@/lib/route-guards'
import { getPrisma } from '@/lib/prisma'

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const prisma = getPrisma()

  try {
    const application = await prisma.internshipApplication.findFirst({
      where: { studentId: userId },
      include: { program: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!application) {
      return NextResponse.json({ error: 'No internship application found.' }, { status: 404 })
    }

    const progress = await prisma.internshipProgress.findUnique({
      where: { userId_programId: { userId, programId: application.programId } },
    })
    const isComplete = !!progress && progress.totalTasks > 0 && progress.progressPercent >= 100
    if (!isComplete) {
      return NextResponse.json({ error: 'Internship not yet completed.' }, { status: 403 })
    }

    const certificate = await prisma.internshipCertificate.findFirst({
      where: { userId, programId: application.programId },
    })
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate has not been issued yet.' }, { status: 404 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    const studentName = user?.name ?? 'Student'

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([842, 595]) // A4 landscape
    const { width, height } = page.getSize()

    const serif = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const serifItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
    const sans = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const navy = rgb(0.11, 0.11, 0.32) // ~#1C1D52
    const green = rgb(0.37, 0.73, 0.28) // ~#5FBB46

    // Border
    page.drawRectangle({ x: 24, y: 24, width: width - 48, height: height - 48, borderColor: green, borderWidth: 3 })
    page.drawRectangle({ x: 34, y: 34, width: width - 68, height: height - 68, borderColor: navy, borderWidth: 1 })

    const centerText = (text: string, y: number, font = sans, size = 12, color = navy) => {
      const textWidth = font.widthOfTextAtSize(text, size)
      page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color })
    }

    centerText('CERTIFICATE OF COMPLETION', height - 110, serif, 28, navy)
    centerText('This certifies that', height - 160, sans, 14, navy)
    centerText(studentName, height - 205, serif, 32, green)
    centerText('has successfully completed the internship program', height - 245, sans, 14, navy)
    centerText(application.program.name, height - 280, serif, 22, navy)
    centerText(`Certificate No. ${certificate.certificateNumber}`, 110, sans, 10, navy)
    centerText(`Issued ${formatDate(certificate.issuedAt)}`, 90, serifItalic, 12, navy)

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${certificate.certificateNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Failed to generate certificate PDF:', error)
    return NextResponse.json({ error: 'Unable to generate certificate.' }, { status: 500 })
  }
}
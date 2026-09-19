import { BookOpen, Users } from 'lucide-react'

import { InstructorPage, StatusBadge } from '@/components/InstructorPage'
import { getPrisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/route-guards'

function getStudentStatus(progress: number) {
  if (progress >= 80) {
    return { label: 'On track', tone: 'green' as const }
  }

  if (progress >= 45) {
    return { label: 'Needs support', tone: 'amber' as const }
  }

  return { label: 'At risk', tone: 'amber' as const }
}

export default async function InstructorStudentsPage() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return (
      <InstructorPage
        title="Students"
        description="View learners enrolled in your courses, monitor progress, and identify who needs additional support."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-[0_8px_24px_rgba(28,29,82,0.08)]">
          Your student feed is unavailable right now.
        </div>
      </InstructorPage>
    )
  }

  const prisma = getPrisma()

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: {
        OR: [{ createdById: userId }, { instructors: { some: { instructorId: userId } } }],
      },
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
      course: true,
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const progressRows = enrollments.length
    ? await prisma.courseProgress.findMany({
        where: {
          courseId: { in: enrollments.map((enrollment) => enrollment.courseId) },
          userId: { in: enrollments.map((enrollment) => enrollment.userId) },
        },
        select: {
          userId: true,
          courseId: true,
          progressPercent: true,
        },
      })
    : []

  const progressMap = new Map(
    progressRows.map((entry) => [`${entry.userId}:${entry.courseId}`, entry.progressPercent]),
  )

  const totalStudents = enrollments.length

  return (
    <InstructorPage
      title="Students"
      description="View learners enrolled in your courses, monitor progress, and identify who needs additional support."
    >
      <section className="rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(28,29,82,0.08)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1D52]">
            <Users className="h-4 w-4 text-[#5FBB46]" />
            {totalStudents} enrolled student{totalStudents === 1 ? '' : 's'}
          </div>
          <div className="rounded-full bg-[#f3f6fb] px-3 py-2 text-[10px] font-medium text-slate-500">
            Updated from your course roster
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
              <tr>
                <th className="pb-3">Student</th>
                <th className="pb-3">Course</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                    No students have enrolled in your courses yet.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => {
                  const fullName =
                    enrollment.user.name ||
                    [enrollment.user.profile?.firstName, enrollment.user.profile?.lastName]
                      .filter(Boolean)
                      .join(' ') ||
                    'Student'

                  const progress = progressMap.get(`${enrollment.userId}:${enrollment.courseId}`) ?? 0
                  const status = getStudentStatus(progress)

                  return (
                    <tr key={`${enrollment.userId}-${enrollment.courseId}`} className="border-t border-slate-100">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dceeff] text-[11px] font-bold text-[#1C1D52]">
                            {fullName
                              .split(' ')
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                          <div>
                            <p className="font-bold text-[#1C1D52]">{fullName}</p>
                            <p className="mt-1 text-[10px] text-slate-500">{enrollment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3.5 w-3.5 text-[#5FBB46]" />
                          {enrollment.course.title}
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-[#1C1D52]">{progress}%</td>
                      <td className="py-4">
                        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                      </td>
                      <td className="py-4 text-slate-500">
                        {new Date(enrollment.enrolledAt).toLocaleDateString('en-NG', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </InstructorPage>
  )
}

import InstructorCourseBuilder from '@/components/InstructorCourseBuilder'
import AdminShell from '@/components/AdminShell'

export default function NewAdminCoursePage() {
  return <AdminShell workspace="student"><InstructorCourseBuilder /></AdminShell>
}

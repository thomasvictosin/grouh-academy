import InstructorCourseBuilder from '@/components/InstructorCourseBuilder'
import AdminShell from '@/components/AdminShell'

export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <AdminShell workspace="student"><InstructorCourseBuilder mode="edit" courseSlug={slug} /></AdminShell>
}

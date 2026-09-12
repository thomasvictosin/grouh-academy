import InstructorCourseBuilder from '@/components/InstructorCourseBuilder'

export default async function EditInstructorCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <InstructorCourseBuilder mode="edit" courseSlug={slug} />
}

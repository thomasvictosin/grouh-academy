import InstructorCourseBuilder from '@/components/InstructorCourseBuilder'

export default async function EditInstructorCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slug.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  return <InstructorCourseBuilder mode="edit" courseTitle={title} />
}

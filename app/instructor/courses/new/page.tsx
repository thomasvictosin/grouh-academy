import { InstructorPage } from '@/components/InstructorPage'
import InstructorCourseBuilder from '@/components/InstructorCourseBuilder'

export default function NewInstructorCoursePage() {
  return <InstructorPage title="Create Course" description="Build your course with the same structured builder used by the academy admin team. Submit it for review when the content is ready."><InstructorCourseBuilder /></InstructorPage>
}

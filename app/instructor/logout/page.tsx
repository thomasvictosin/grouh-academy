import LogoutConfirmation from '@/components/LogoutConfirmation'

export const metadata = {
  title: 'Log Out | Instructor Workspace',
}

export default function InstructorLogoutPage() {
  return <LogoutConfirmation title="Leave your instructor workspace?" description="You will need to sign in again to access your courses, students, assignments, and analytics." cancelHref="/instructor" />
}

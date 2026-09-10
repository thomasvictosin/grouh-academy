import LogoutConfirmation from '@/components/LogoutConfirmation'

export const metadata = {
  title: 'Log Out | Mentor Workspace',
}

export default function MentorLogoutPage() {
  return <LogoutConfirmation title="Leave your mentor workspace?" description="You will need to sign in again to access your interns, messages, tasks, and assessments." cancelHref="/mentor" />
}

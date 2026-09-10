import LogoutConfirmation from '@/components/LogoutConfirmation'

export const metadata = {
  title: 'Log Out | Internship Workspace',
}

export default function InternshipLogoutPage() {
  return (
    <LogoutConfirmation
      title="Leave your internship workspace?"
      description="You will need to sign in again to access your internship dashboard, tasks, and group discussions."
      cancelHref="/internship/dashboard"
      logoutHref="/login"
    />
  )
}

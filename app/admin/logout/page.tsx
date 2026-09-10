import LogoutConfirmation from '@/components/LogoutConfirmation'

export const metadata = {
  title: 'Log Out | Admin Workspace',
}

export default function AdminLogoutPage() {
  return <LogoutConfirmation title="Leave your admin workspace?" description="You will need to sign in again to access academy administration, reports, payments, and settings." cancelHref="/admin/student" />
}

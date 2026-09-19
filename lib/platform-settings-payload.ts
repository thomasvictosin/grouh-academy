export type PlatformSettingsPayload = {
  academyName: string
  supportEmail: string
  platformUrl: string | null
  defaultLanguage: string
  timezone: string
  maxUploadSizeMb: number
  courseEnrollmentEnabled: boolean
  allowStudentRegistration: boolean
  enableCourseReviews: boolean
  autoApproveCourses: boolean
  internshipApplicationsEnabled: boolean
  maintenanceMode: boolean
  certificateIssuerName: string
  certificatePrefix: string
  certificateMinimumCompletion: number
  automaticCertificateIssue: boolean
  notifyAdminOnRegistration: boolean
  notifyAdminOnPayment: boolean
  notifyStudentOnEnrollment: boolean
  notifyStudentOnCertificate: boolean
  updatedAt: string
}

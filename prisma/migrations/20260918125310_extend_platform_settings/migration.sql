-- AlterTable
ALTER TABLE "PlatformSettings" ADD COLUMN     "allowStudentRegistration" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoApproveSubmittedCourses" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "certificateNumberPrefix" TEXT NOT NULL DEFAULT 'CERT-INT',
ADD COLUMN     "defaultAssessmentPassScore" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "defaultLanguage" TEXT NOT NULL DEFAULT 'English (US)',
ADD COLUMN     "enableCourseReviews" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxGroupSize" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "maxUploadSizeMb" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "platformName" TEXT NOT NULL DEFAULT 'Grouh Academy',
ADD COLUMN     "premiumTier1Amount" INTEGER NOT NULL DEFAULT 100000,
ADD COLUMN     "premiumTier2Amount" INTEGER NOT NULL DEFAULT 400000,
ADD COLUMN     "updatedById" UUID,
ALTER COLUMN "id" SET DEFAULT 'singleton';

-- AddForeignKey
ALTER TABLE "PlatformSettings" ADD CONSTRAINT "PlatformSettings_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "ThemeMode" AS ENUM ('LIGHT', 'DARK');

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "profileVisible" BOOLEAN NOT NULL DEFAULT true,
    "showLearningStats" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "courseUpdates" BOOLEAN NOT NULL DEFAULT true,
    "assignmentReminders" BOOLEAN NOT NULL DEFAULT false,
    "gradeNotifications" BOOLEAN NOT NULL DEFAULT true,
    "mentorshipMessages" BOOLEAN NOT NULL DEFAULT false,
    "theme" "ThemeMode" NOT NULL DEFAULT 'LIGHT',
    "language" TEXT NOT NULL DEFAULT 'English (US)',
    "timezone" TEXT NOT NULL DEFAULT 'GMT+1 (West Africa Time)',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

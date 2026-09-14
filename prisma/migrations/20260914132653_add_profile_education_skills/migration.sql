/*
  Warnings:

  - A unique constraint covering the columns `[studentId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "enrollmentDate" TIMESTAMP(3),
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "studentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_studentId_key" ON "Profile"("studentId");

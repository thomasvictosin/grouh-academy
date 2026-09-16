-- CreateEnum
CREATE TYPE "InternshipApplicationStatus" AS ENUM ('ACTIVE', 'ON_HOLD');

-- AlterTable
ALTER TABLE "InternshipApplication" ADD COLUMN     "status" "InternshipApplicationStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT;

-- CreateTable
CREATE TABLE "InternshipCertificate" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "programId" TEXT NOT NULL,
    "applicationId" TEXT,
    "title" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipCertificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InternshipCertificate_certificateNumber_key" ON "InternshipCertificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "InternshipCertificate_userId_idx" ON "InternshipCertificate"("userId");

-- CreateIndex
CREATE INDEX "InternshipCertificate_programId_idx" ON "InternshipCertificate"("programId");

-- AddForeignKey
ALTER TABLE "InternshipCertificate" ADD CONSTRAINT "InternshipCertificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipCertificate" ADD CONSTRAINT "InternshipCertificate_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InternshipProgram"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipCertificate" ADD CONSTRAINT "InternshipCertificate_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InternshipApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

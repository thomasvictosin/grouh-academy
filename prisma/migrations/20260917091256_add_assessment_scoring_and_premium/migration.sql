-- CreateEnum
CREATE TYPE "PremiumTier" AS ENUM ('NONE', 'TIER_100K', 'TIER_400K');

-- AlterTable
ALTER TABLE "AssessmentAttempt" ADD COLUMN     "score" INTEGER,
ADD COLUMN     "scorePercent" INTEGER,
ADD COLUMN     "totalQuestions" INTEGER;

-- AlterTable
ALTER TABLE "InternshipApplication" ADD COLUMN     "onboardingAnswers" JSONB,
ADD COLUMN     "premiumActivatedAt" TIMESTAMP(3),
ADD COLUMN     "premiumTier" "PremiumTier" NOT NULL DEFAULT 'NONE';

-- CreateEnum
CREATE TYPE "TaskKind" AS ENUM ('INDIVIDUAL', 'GROUP');

-- AlterTable
ALTER TABLE "InternshipTask" ADD COLUMN     "kind" "TaskKind" NOT NULL DEFAULT 'INDIVIDUAL';

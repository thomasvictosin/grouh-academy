-- AlterTable
ALTER TABLE "User" ADD COLUMN     "meetingReminders" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "InternshipGroup" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 12,
    "leaderId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternshipGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternshipGroupMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternshipGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMessage" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMeeting" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdById" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Group Meeting',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternshipGroup_programId_idx" ON "InternshipGroup"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipGroup_programId_number_key" ON "InternshipGroup"("programId", "number");

-- CreateIndex
CREATE INDEX "InternshipGroupMember_groupId_idx" ON "InternshipGroupMember"("groupId");

-- CreateIndex
CREATE INDEX "InternshipGroupMember_userId_idx" ON "InternshipGroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InternshipGroupMember_programId_userId_key" ON "InternshipGroupMember"("programId", "userId");

-- CreateIndex
CREATE INDEX "GroupMessage_groupId_createdAt_idx" ON "GroupMessage"("groupId", "createdAt");

-- CreateIndex
CREATE INDEX "GroupMessage_senderId_idx" ON "GroupMessage"("senderId");

-- CreateIndex
CREATE INDEX "GroupMeeting_groupId_scheduledAt_idx" ON "GroupMeeting"("groupId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "InternshipGroup" ADD CONSTRAINT "InternshipGroup_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InternshipProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipGroup" ADD CONSTRAINT "InternshipGroup_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipGroupMember" ADD CONSTRAINT "InternshipGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "InternshipGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternshipGroupMember" ADD CONSTRAINT "InternshipGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "InternshipGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMeeting" ADD CONSTRAINT "GroupMeeting_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "InternshipGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMeeting" ADD CONSTRAINT "GroupMeeting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

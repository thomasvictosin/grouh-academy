-- CreateEnum
CREATE TYPE "AnnouncementScope" AS ENUM ('GLOBAL', 'MENTOR_MENTEES');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "mentorId" UUID NOT NULL,
    "internId" UUID NOT NULL,
    "programId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "authorId" UUID NOT NULL,
    "scope" "AnnouncementScope" NOT NULL,
    "programId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_mentorId_idx" ON "Conversation"("mentorId");

-- CreateIndex
CREATE INDEX "Conversation_internId_idx" ON "Conversation"("internId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_mentorId_internId_programId_key" ON "Conversation"("mentorId", "internId", "programId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Announcement_scope_idx" ON "Announcement"("scope");

-- CreateIndex
CREATE INDEX "Announcement_authorId_idx" ON "Announcement"("authorId");

-- CreateIndex
CREATE INDEX "Announcement_programId_idx" ON "Announcement"("programId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_internId_fkey" FOREIGN KEY ("internId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InternshipProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_programId_fkey" FOREIGN KEY ("programId") REFERENCES "InternshipProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

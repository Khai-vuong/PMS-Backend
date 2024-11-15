/*
  Warnings:

  - You are about to drop the column `extention` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `mails` on the `User` table. All the data in the column will be lost.
  - Added the required column `extension` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "extention",
ADD COLUMN     "extension" TEXT NOT NULL,
ADD COLUMN     "mrid" CHAR(6),
ADD COLUMN     "path" TEXT NOT NULL,
ALTER COLUMN "fid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "pid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "tid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6),
ALTER COLUMN "due" SET DEFAULT (now() + interval '7 days')::timestamp;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "mails",
ALTER COLUMN "uid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- CreateTable
CREATE TABLE "MergeRequest" (
    "mrid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sender_uid" TEXT NOT NULL,
    "approver_uid" TEXT NOT NULL,
    "tid" TEXT NOT NULL,

    CONSTRAINT "MergeRequest_pkey" PRIMARY KEY ("mrid")
);

-- CreateTable
CREATE TABLE "Mail" (
    "mid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Authorization',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mrid" TEXT NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("mid")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_mrid_fkey" FOREIGN KEY ("mrid") REFERENCES "MergeRequest"("mrid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_sender_uid_fkey" FOREIGN KEY ("sender_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_approver_uid_fkey" FOREIGN KEY ("approver_uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_tid_fkey" FOREIGN KEY ("tid") REFERENCES "Task"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_mrid_fkey" FOREIGN KEY ("mrid") REFERENCES "MergeRequest"("mrid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mail" ADD CONSTRAINT "Mail_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

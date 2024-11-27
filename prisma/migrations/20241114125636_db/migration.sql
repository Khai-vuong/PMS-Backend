-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_project_pid_fkey";

-- DropForeignKey
ALTER TABLE "MergeRequest" DROP CONSTRAINT "MergeRequest_approver_uid_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "fid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6),
ALTER COLUMN "project_pid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mail" ALTER COLUMN "mid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "MergeRequest" ALTER COLUMN "mrid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6),
ALTER COLUMN "approver_uid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "pid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "tid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6),
ALTER COLUMN "due" SET DEFAULT (now() + interval '7 days')::timestamp;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_project_pid_fkey" FOREIGN KEY ("project_pid") REFERENCES "Project"("pid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MergeRequest" ADD CONSTRAINT "MergeRequest_approver_uid_fkey" FOREIGN KEY ("approver_uid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `extended_name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "extended_name" TEXT NOT NULL,
ALTER COLUMN "fid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Mail" ALTER COLUMN "mid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "MergeRequest" ALTER COLUMN "mrid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "pid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "tid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6),
ALTER COLUMN "due" SET DEFAULT (now() + interval '7 days')::timestamp;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

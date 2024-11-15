-- AlterTable
ALTER TABLE "File" ALTER COLUMN "fid" SET DEFAULT substring(gen_random_uuid()::text, 1, 6);

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

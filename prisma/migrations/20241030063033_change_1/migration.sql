-- CreateTable
CREATE TABLE "User" (
    "uid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "google_id" TEXT,
    "email" TEXT NOT NULL,
    "mails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "login_method" TEXT NOT NULL DEFAULT 'LOCAL',

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Project" (
    "pid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "Task" (
    "tid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Undone',
    "comment" TEXT,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '7 days')::timestamp,
    "project_pid" TEXT NOT NULL,
    "assignee_id" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("tid")
);

-- CreateTable
CREATE TABLE "File" (
    "fid" CHAR(6) NOT NULL DEFAULT substring(gen_random_uuid()::text, 1, 6),
    "name" TEXT NOT NULL,
    "extention" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "uploaded_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_pid" TEXT NOT NULL,
    "task_tid" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "_ManagerProjects" (
    "A" CHAR(6) NOT NULL,
    "B" CHAR(6) NOT NULL
);

-- CreateTable
CREATE TABLE "_MemberProjects" (
    "A" CHAR(6) NOT NULL,
    "B" CHAR(6) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_ManagerProjects_AB_unique" ON "_ManagerProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_ManagerProjects_B_index" ON "_ManagerProjects"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberProjects_AB_unique" ON "_MemberProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberProjects_B_index" ON "_MemberProjects"("B");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_pid_fkey" FOREIGN KEY ("project_pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_project_pid_fkey" FOREIGN KEY ("project_pid") REFERENCES "Project"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_task_tid_fkey" FOREIGN KEY ("task_tid") REFERENCES "Task"("tid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagerProjects" ADD CONSTRAINT "_ManagerProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagerProjects" ADD CONSTRAINT "_ManagerProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberProjects" ADD CONSTRAINT "_MemberProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("pid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberProjects" ADD CONSTRAINT "_MemberProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

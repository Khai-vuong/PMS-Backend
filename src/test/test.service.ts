import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { CreateProjectDto } from 'DTOs/create-projects.dto';

@Injectable()
export class TestService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly projectsService: ProjectsService
    ) { }

    async generateTask(pid: string, uid: string) {
        const findPRoject = this.prisma.project.findFirst({
            where: { pid },
        });

        const findUser = this.prisma.user.findFirst({
            where: { uid }
        })

        // Check if the task named 'generated' exists
        const findGenerated = this.prisma.task.findFirst({
            where: {
                name: 'generated',
            },
        });

        const [project, user, existingTask] = await Promise.all([findPRoject, findUser, findGenerated]);

        if (!project) {
            throw new NotFoundException(`Project with ID ${pid} not found`);
        }

        if (!user) {
            throw new NotFoundException(`User with ID ${uid} not found`);
        }

        if (!existingTask) {
            await this.prisma.task.create({
                data: {
                    name: 'generated',
                    description: 'This is a generated task',
                    status: 'Done',
                    project_pid: pid,
                    due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    assignee_id: uid,
                },
            });

            // Create 13 tasks
            const tasks = Array.from({ length: 13 }, (_, index) => ({
                name: `${index + 1}`,
                description: `description ${index + 1}`,
                status: 'Done',
                due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                assignee_id: uid,
                project_pid: pid,
            }));

            return this.prisma.task.createMany({
                data: tasks,
                // assignee_id: { connect: { uid } },
                // project_pid: { connect: { pid } },

            });
        }
        else {
            return { message: "This database is already generated" };
        }


    }

    async generateUsers() {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: 'generated' },
        });

        if (!existingUser) {
            const users = ['aaa', 'bbb', 'ccc', 'ddd', 'eee'].map(username => ({
                username,
                password: username,
                email: '',
            }));

            users.push({
                username: 'generated',
                password: '111',
                email: '',
            });

            return this.prisma.user.createMany({
                data: users,
            });
        }
    }

    async generateProjects(uid: string) {
        if (typeof uid !== 'string') {
            throw new Error('userId must be a string, current type = ' + typeof uid);
        }

        const existingProject = await this.prisma.project.findFirst({
            where: { name: 'generated' },
        });

        if (!existingProject) {
            const projects: CreateProjectDto[] = [
                {
                    name: 'generated',
                    description: 'This is a generated project',
                    model: 'Agile',
                    phase: 'Planning',
                },
                {
                    name: 'Test 1',
                    description: 'This is Test Project 1',
                    model: 'Waterfall',
                    phase: 'Execution',
                },
                {
                    name: 'Test 2',
                    description: 'This is Test Project 2',
                    model: 'Scrum',
                    phase: 'Closure',
                },
            ];


            const createdProjects = await Promise.all(
                projects.map(project => this.projectsService.createProject(uid as string, project))
            );

            return { count: createdProjects.length };
        } else {
            return { message: "The project 'generated' already exists" };
        }
    }

    async getDatabase() {
            const tables = ['user', 'project', 'task', 'file', 'mergeRequest', 'mail'];

            const data = await Promise.all(
                tables.map(table => this.prisma[table].findMany())
            );

            return {
                users: data[0],
                projects: data[1],
                tasks: data[2],
                files: data[3],
                MR: data[4],
                mail: data[5]
            };
    }
}

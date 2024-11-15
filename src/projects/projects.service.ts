import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateProjectDto } from "DTOs/create-projects.dto";
import { UpdateProjectDto } from "DTOs/update-projects-dto";
import { ProjectsListDto } from "DTOs/projects-list.dto";

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async createProject(userID: string, createProjectDto: CreateProjectDto) {
        return await this.prisma.project.create({
            data: {
                ...createProjectDto,
                manager_ids: {
                    connect: { uid: userID },
                },
                members: {
                    connect: createProjectDto.members?.map(memberId => ({ uid: memberId })) || [],
                },
            },
        });
    }

    async updateProject(userID: string, pid: string, updateProjectDto: UpdateProjectDto) {
        const existingProject = await this.prisma.project.findUnique({
            include: { manager_ids: true },
            where: { pid },
        });

        if (!existingProject) {
            throw new HttpException(`Project with pid ${pid} not found`, HttpStatus.NOT_FOUND);
        }

        if (!existingProject.manager_ids.some(manager => manager.uid === userID)) {
            throw new HttpException(`You are not the manager of this project.`, HttpStatus.FORBIDDEN);
        }

        return await this.prisma.project.update({
            where: { pid },
            data: {
                ...updateProjectDto,
                manager_ids: {
                    connect: updateProjectDto.manager_ids?.map(managerId => ({ uid: managerId })) || [],
                },
                members: {
                    connect: updateProjectDto.members?.map(memberId => ({ uid: memberId })) || [],
                },
            },
        });
    }

    async deleteProject(userID: string, pid: string) {
        const existingProject = await this.prisma.project.findUnique({
            include: { manager_ids: true },
            where: { pid },
        });

        if (!existingProject) {
            throw new HttpException(`Project with pid ${pid} not found`, HttpStatus.NOT_FOUND);
        }

        if (!existingProject.manager_ids.some(manager => manager.uid === userID)) {
            throw new HttpException(`You are not the manager of this project.`, HttpStatus.FORBIDDEN);
        }

        return await this.prisma.project.delete({
            where: { pid },
        })
    }

    async listProjects(userID: string) {
        const listProjects = await this.prisma.project.findMany({
            include: {
                manager_ids: true,
                members: true,
            },
        });

        const projectsInfo: ProjectsListDto[] = listProjects.map(project => {
            const { name, model, phase, manager_ids, pid } = project;
            const role = manager_ids.some(manager => manager.uid === userID) ? 'Project manager' : (manager_ids.some(members => members.uid === userID) ? 'Member' : null);

            return role ? { name, model, phase, role, pid } as ProjectsListDto : null;
        }).filter((project): project is ProjectsListDto => project !== null);

        return projectsInfo;
    }

    async getProject(userID: string, pid: string) {
        const existingProject = await this.prisma.project.findUnique({
            include: { manager_ids: true },
            where: { pid },
        });

        if (!existingProject) {
            throw new HttpException(`Project with pid ${pid} not found`, HttpStatus.NOT_FOUND);
        }

        const projectInfo: ProjectsListDto = {
            name: existingProject.name,
            model: existingProject.model,
            phase: existingProject.phase,
            role: existingProject.manager_ids.some(manager => manager.uid === userID) ? 'Project manager' : 'Member',
            pid: existingProject.pid,
        };

        return projectInfo;
    }
}
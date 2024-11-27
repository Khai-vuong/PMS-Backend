import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { InitLobbyDTO, PageDTO, TaskReturnDTO } from '../../DTOs/page.dto';


@Injectable()
export class LobbyService {
    constructor(private prisma: PrismaService) { }
    async getUserName(uid: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: { uid: uid }
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user.username;
    }
    async getTasks(pid: string, page: string, pageSize: string, userID: string) {
        const project = await this.prisma.project.findUnique({
            where: { pid: pid },
            include: { tasks: true }
        });
        if (!project) {
            throw new NotFoundException("Project not found");
        }
        if (!project.tasks.length) {
            throw new NotFoundException("No task found");
        }
        return this.Pagination(project.tasks, page, pageSize);
    }
    async Pagination(tasks: any[], page: string, pageSize: string) {
        const perPage = parseInt(pageSize);
        const pagenum = parseInt(page);
        const start = (pagenum - 1) * perPage;
        const end = start + perPage;
        let data = [];
        if (start > tasks.length - 1) {
            throw new NotFoundException("Invalid page number");
        }
        if (end > tasks.length) {
            data = tasks.slice(start, tasks.length);
        }
        else {
            data = tasks.slice(start, end);
        }
        if (data.length === 0) {
            throw new NotFoundException("No task found in this page");
        }
        const taskReturnData = await Promise.all(data.map(async (task) => {
            const assigneeUsername = await this.getUserName(task.assignee_id);
            return new TaskReturnDTO(task.tid, task.name, task.description, assigneeUsername);
        }));
        const pageCount = Math.ceil(tasks.length / perPage);
        const pageMeta = {
            pageCount: pageCount,
            pageSize: perPage,
            currentPage: pagenum,
            hasPreviousPage: pagenum > 1,
            hasNextPage: pagenum < pageCount
        };
        const returnData = new PageDTO<TaskReturnDTO>(taskReturnData, pageMeta);

        return returnData;
    }
    async initLobby(pid: string, userID: string) {
        const project = await this.prisma.project.findUnique({
            where: { pid: pid },
            include: {
                tasks: true,
                manager_ids: true
            }
        });

        if (!project) {
            throw new NotFoundException("Project not found");
        }

        const user = await this.prisma.user.findUnique({
            where: { uid: userID }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const role = await this.prisma.getUserRole(userID, pid) as 'Project Manager' | 'Member' | 'Guest';
        const data = new InitLobbyDTO(user.username, role, project.name, project.description, project.model, project.phase, await this.getTasks(pid, '1', '5', userID));
        return data;

    }
}

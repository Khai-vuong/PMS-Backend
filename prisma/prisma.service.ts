import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Project } from '@prisma/client';
import { UserRole, UserRoleDTO } from 'DTOs/user-role.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        //Recommend to use ConfigService to get the database UR, maybe in the future
        super({
            datasources: {
                db: {
                    url: "postgresql://postgres:yfycRjJPZkxuLYjuOPVHSmBzkantfuVF@autorack.proxy.rlwy.net:23613/railway"
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async getUserRole(uid: string, pid: string): Promise<string> {
        const project = await this.project.findUnique({
            where: { pid: pid },
            include: { members: true, manager_ids: true },
        });

        if (!project) {
            throw new Error('Project not found');
        }

        const isManager = project.manager_ids.some(manager => manager.uid === uid);
        if (isManager) {
            return 'Project Manager'
        }
        else {
            const isMember = project.members.some(member => member.uid === uid);
            if (isMember) {
                return 'Member';
            }
            else return 'Guest';
        }
    }
}
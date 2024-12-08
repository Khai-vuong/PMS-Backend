import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UtilsService {
  constructor(private prismaService: PrismaService) {}

  async getMember(pid: string) {
    const project = await this.prismaService.project.findUnique({
      select: { members: true, manager_ids: true },
      where: { pid: pid },
    });

    if (!project) {
      throw new NotFoundException(`Project with pid ${pid} not found`);
    }

    const result = {
      member: project.members.map(member => member.username),
      manager: project.manager_ids.map(manager => manager.username),
    };

    return result;
  }
}

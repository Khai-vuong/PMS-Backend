import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from 'DTOs/create-task.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(pid: string, createTaskDto: CreateTaskDto, userID: string) {
    const { assignee, ...otherData } = createTaskDto;

    const [existingProject, existingAssignee, existingManager] =
      await Promise.all([
        this.prisma.project.findUnique({
          include: { manager_ids: true },
          where: { pid },
        }),

        this.prisma.user.findUnique({
          where: { username: assignee },
        }),

        this.prisma.user.findUnique({
          where: { uid: userID },
        }),
      ]);

    if (!existingManager) {
      throw new HttpException(
        `Do not have permission to create a task`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (!existingProject) {
      throw new HttpException(
        `Project with pid ${pid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!existingAssignee) {
      throw new HttpException(
        `User with username ${assignee} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.prisma.task.create({
      data: {
        ...otherData,
        project: {
          connect: { pid: pid },
        },
        assignee: {
          connect: { uid: existingAssignee.uid },
        },
      },
    });
  }

  async createMergeRequest(tid: string, userID: string) {
    const existingTask = await this.prisma.task.findUnique({ where: { tid } });

    if (!existingTask) {
      throw new HttpException(
        `Task with tid ${tid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (existingTask.assignee_id !== userID) {
      throw new HttpException(
        `You are not the assignee of this task. You can't create a merge request`,
        HttpStatus.FORBIDDEN,
      );
    }
    return { tid, taskName: existingTask.name };
  }

  async createMergeRequestPost(tid: string, comment: string, userID: string) {
    const existingTask = await this.prisma.task.findUnique({ where: { tid } });

    if (!existingTask) {
      throw new HttpException(
        `Task with tid ${tid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (existingTask.assignee_id !== userID) {
      throw new HttpException(
        `You are not the assignee of this task. You can't create a merge request`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.task.update({
      where: { tid },
      data: {
        comment: comment,
      },
    });
    return { message: `success` };
  }

  async getName(tid: string) {
    const existingTask = await this.prisma.task.findUnique({ where: { tid } });

    if (!existingTask) {
      throw new HttpException(
        `Task with tid ${tid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return { name: existingTask.name };
  }
  // async findAll() {
  //     return await this.prisma.task.findMany();
  // }

  // async findOne(id: string) {
  //     const existingTask = await this.prisma.task.findUnique({ where: { tid: id } });
  //     if (!existingTask) {
  //         throw new HttpException(`Task with tid ${id} not found`, HttpStatus.NOT_FOUND);
  //     }
  //     return existingTask;
  // }

  // async update(id: string, updateTaskDto: UpdateTaskDto, userID: string) {
  //     const { pid, assignee_id, ...otherData } = updateTaskDto;

  //     const [existingProject, existingUser] = await Promise.all([
  //         this.prisma.project.findUnique({
  //             include: { manager_ids: true },
  //             where: { pid },
  //         }),

  //         this.prisma.user.findUnique({
  //             where: { uid: assignee_id }
  //         }),
  //     ]);

  //     if (!existingProject) {
  //         throw new HttpException(`Project with pid ${pid} not found`, HttpStatus.NOT_FOUND);
  //     }

  //     if (!existingProject.manager_ids.some(manager => manager.uid === userID)) {
  //         throw new HttpException(`You are not the manager of this project. You can't create a new task`, HttpStatus.FORBIDDEN);
  //     }

  //     if (!existingUser) {
  //         throw new HttpException(`User with uid ${assignee_id} not found`, HttpStatus.NOT_FOUND);
  //     }

  //     return 'This action updates a task';
  // }

  // remove(id: number) {
  //     return `This action removes a #${id} task`;
  // }
}

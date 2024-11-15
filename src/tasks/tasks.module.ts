import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, AuthService],
  exports: [TasksService],
})
export class TasksModule { }

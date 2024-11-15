import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [ProjectsModule],
  providers: [TestService, PrismaService, ProjectsService],
  controllers: [TestController]
})
export class TestModule { }

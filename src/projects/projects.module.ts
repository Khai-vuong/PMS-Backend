import { Module } from "@nestjs/common";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { PrismaService } from "prisma/prisma.service";
import { AuthService } from "src/auth/auth.service";

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService, PrismaService, AuthService],
    exports: [ProjectsService]
})
export class ProjectsModule { }
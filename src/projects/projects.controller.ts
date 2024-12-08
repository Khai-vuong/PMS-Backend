import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { GetUserID } from "src/utils/get-user.decorator";
import { LocalGuard } from "src/utils/local.guard";
import { CreateProjectDto } from "DTOs/create-projects.dto";
import { UpdateProjectDto } from "DTOs/update-projects-dto";
import { IsManagerGuard } from "src/is-manager/is-manager.guard";

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(LocalGuard)
    @Get('list')
    async listProjects(@GetUserID() user: any) {
        return this.projectsService.listProjects(user.userID);
    }

    @UseGuards(LocalGuard)
    @Get(':pid')
    async getProject(@GetUserID() user: any, @Param('pid') pid: string) {
        return this.projectsService.getProject(user.userID, pid);
    }

    @UseGuards(LocalGuard)
    @Post('create')
    async createProject(
        @GetUserID() user: any,
        @Body() input: any
    ) {
        const createProjectDto: CreateProjectDto = input;

        return this.projectsService.createProject(user.userID, createProjectDto);
    }

    @UseGuards(LocalGuard)
    @Patch(':pid')
    async updateProjectByPatch(@GetUserID() user: any, @Param('pid') pid: string, @Body() input: any) {
        // const { username, password, ...project } = input;
        const updateProject: UpdateProjectDto = input;

        return this.projectsService.updateProject(user.userID, pid, updateProject);
    }

    @UseGuards(LocalGuard)
    @Delete(':pid')
    async deleteProject(@GetUserID() user: any, @Param('pid') pid: string) {
        return this.projectsService.deleteProject(user.userID, pid);
    }
    // @UseGuards(IsManagerGuard)
    @UseGuards(LocalGuard)
    @Put('authorize')
    async authorizeMember(
        @GetUserID() user: any,
        @Query('member') memberName: string,
        @Query('pid') projectId: string
    ) {
        console.log('authorizeMember: ', user, memberName, projectId);
        return this.projectsService.toggleMemberRole(user.userID, memberName, projectId);
    }
    // @UseGuards(IsManagerGuard)
    @UseGuards(LocalGuard)
    @Post('NextPhase')
    async switchPhase(
        @Query('pid') projectId: string
    ) {
        return this.projectsService.switchProjectPhase( projectId);
    }

    @UseGuards(LocalGuard)
    @Post('invite')
    async  inviteMember( @Query('pid') pid: string, @Query('name') memberName: string) {

        return this.projectsService.inviteMember(pid, memberName);
    }
    
}
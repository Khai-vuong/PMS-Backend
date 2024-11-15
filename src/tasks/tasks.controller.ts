import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'DTOs/create-task.dto';
import { LocalGuard } from 'src/utils/local.guard';
import { GetUserID } from 'src/utils/get-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @UseGuards(LocalGuard)
  @Post('new')
  async create(@Query('pid') pid: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUserID() user: any) {
    return this.tasksService.create(pid, createTaskDto, user.userID);
  }

  @UseGuards(LocalGuard)
  @Get('create-mr')
  async createMergeRequest(@Query('tid') tid: string, @GetUserID() user: any) {
    return this.tasksService.createMergeRequest(tid, user.userID);
  }

  @UseGuards(LocalGuard)
  @Post('create-mr')
  async createMergeRequestPost(@Query('tid') tid: string, @Body('comment') comment: string, @GetUserID() user: any) {
    return this.tasksService.createMergeRequestPost(tid, comment, user.userID);
  }

  // @UseGuards(LocalGuard)
  // @Get('all')
  // async findAll() {
  //   return this.tasksService.findAll();
  // }

  // @UseGuards(LocalGuard)
  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return await this.tasksService.findOne(id);
  // }

  // @UseGuards(LocalGuard)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUserID() user: any) {
  //   return this.tasksService.update(id, updateTaskDto, user.userID);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tasksService.remove(+id);
  // }
}

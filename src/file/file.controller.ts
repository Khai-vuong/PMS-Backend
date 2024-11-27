import {
  Controller,
  HttpException,
  Post,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { diskStorage } from 'multer';
import { LocalGuard } from 'src/utils/local.guard';
import { GetUserID } from 'src/utils/get-user.decorator';
import { extname } from 'path';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(LocalGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() input: { task_id: string; project_id: string },
    @GetUserID() user: any,
  ) {
    if (!file) {
      throw new HttpException('File not found', 404);
    }
    const { task_id, project_id } = input;
    return this.fileService.uploadFile(
      project_id ? project_id : 'ni' /* ni : no information */,
      task_id ? task_id : 'ni',
      user.userID,
      file,
    );
  }

  @UseGuards(LocalGuard)
  @Get('get-info')
  async getFileInfo(@Query('fid') fid: string) {
    return this.fileService.getFileInfo(fid);
  }

  // @UseGuards(LocalGuard)
  // @Put('update-info')
  // async updateFileInfo(@Body() input: { fid: string; name: string }) {
  //   return this.fileService.updateFileInfo(input);
  // }

  @UseGuards(LocalGuard)
  @Get('downloadFromTask')
  async downloadFileByTid(@Query('tid') tid: string, @Res() res: any) {
    return this.fileService.downloadFileByTid(tid, res);
  }

  @UseGuards(LocalGuard)
  @Get('downloadFromProject')
  async downloadFileByPid(@Query('pid') pid: string, @Res() res: any) {
    return this.fileService.downloadFileByPid(pid, res);
  }

  // @Post('create-mr')
  // @UseInterceptors(FileInterceptor('file'))
  // createMR(
  //   @Query('tid') tid: string,
  //   @Query('uid') uid: string,
  //   @UploadedFile() file,
  // ) {
  //   if (!file) {
  //     throw new HttpException('File not found', 404);
  //   }
  //   return this.fileService.createMR(tid, uid, file);
  // }

  // @Get('fromTask')
  // async downloadTaskFiles(@Query('tid') tid: string) {
  //   return this.fileService.downloadFilesByTask(tid);
  // }

  // @Get('fromProject')
  // async downloadProjectFiles(@Query('pid') pid: string) {
  //   return this.fileService.downloadFilesByProject(pid);
  // }
}

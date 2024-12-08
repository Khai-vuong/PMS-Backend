import {
  HttpException,
  Injectable,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { extname } from 'path';
import * as archiver from 'archiver';
import { PrismaService } from 'prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class FileService {
  private rootFolder: string;

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {
    this.rootFolder = this.configService.get<string>('ROOTFOLDER');
  }

  async uploadFile(
    project_id: string,
    task_id: string,
    userID: string,
    file: Express.Multer.File,
  ) {
    const createdFile = await this.prismaService.file.create({
      data: {
        name: file.originalname,
        extension: extname(file.originalname),
        size: file.size + ' bytes',
        path: file.destination,
        project:
          project_id !== 'ni' ? { connect: { pid: project_id } } : undefined,
        task: { connect: { tid: task_id } },
        uploader: { connect: { uid: userID } },
      },
    });

    const newFileName = `${project_id !== 'ni' ? `p${createdFile.project_pid}_` : ``}${
      task_id !== 'ni' ? `t${createdFile.task_tid}_` : ``
    }f${createdFile.fid}${extname(file.originalname)}`;

    const uploadFile = await this.prismaService.file.update({
      where: { fid: createdFile.fid },
      data: {
        extended_name: newFileName,
        path: path.join(file.destination, newFileName),
      },
    });

    const newPath = path.join(file.destination, newFileName);
    const oldPath = path.join(file.destination, file.filename);
    fs.renameSync(oldPath, newPath);
    console.log('file uploaded', uploadFile);
    return { message: 'File uploaded successfully' };
  }

  async getFileInfo(fid: string) {
    const fileInfo = await this.prismaService.file.findUnique({
      where: { fid },
      include: { uploader: true, project: true, task: true },
    });

    if (!fileInfo) throw new HttpException('File not found', 404);
    return {
      name: fileInfo.name,
      ext: fileInfo.extension,
      size: fileInfo.size,
      path: fileInfo.path,
      uploader: fileInfo.uploader.username,
      project: fileInfo.project ? fileInfo.project.name : 'No project',
      task: fileInfo.task ? fileInfo.task.name : 'No task',
    };
  }

  async downloadFileByTid(tid: string, res: any) {
    const task = await this.prismaService.task.findUnique({
      where: { tid },
      include: { files: true },
    });
    if (!task) throw new HttpException('Task not found', 404);

    const filePaths = task.files.map(file => file.path);
    const tempDir = path.join(this.rootFolder, 'temp', `task_${tid}`);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    for (const filePath of filePaths) {
      const file = path.basename(filePath);
      fs.copyFileSync(filePath, path.join(tempDir, file));
    }

    const zipPath = path.join(this.rootFolder, 'temp', `task_${tid}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(tempDir, false).pipe(output);
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, (err: number) => {
        if (err) throw new HttpException('Download failed', err);
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });
  }

  async downloadFileByPid(pid: string, res: any) {
    const project = await this.prismaService.project.findUnique({
      where: { pid },
      include: {
        files: {
          where: {
            status: 'Approved', // Lọc file có trạng thái "Approved"
          },
        },
      },
    });
    if (!project) throw new HttpException('Project not found', 404);

    const filePaths = project.files.map(file => file.path);
    const tempDir = path.join(this.rootFolder, 'temp', `project_${pid}`);

    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    for (const filePath of filePaths) {
      const file = path.basename(filePath);
      fs.copyFileSync(filePath, path.join(tempDir, file));
    }

    const zipPath = path.join(this.rootFolder, 'temp', `project_${pid}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.directory(tempDir, false).pipe(output);
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, (err: number) => {
        if (err) throw new HttpException('Download failed', err);
        fs.rmSync(tempDir, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
      });
    });
  }

  async updateExtendedName(fid: string, extended_name: string) {
    const oldPath = (
      await this.prismaService.file.findUnique({
        where: { fid },
        select: { path: true },
      })
    ).path;
    const newPath = `${this.rootFolder}/${extended_name}`;
    fs.renameSync(oldPath, newPath);
    const updatedFile = await this.prismaService.file.update({
      where: { fid },
      data: { extended_name: extended_name, path: newPath },
    });
    return { message: 'File name updated' };
  }
}

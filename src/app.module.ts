import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TestModule } from './test/test.module';
import { LobbyModule } from './lobby/lobby.module';
import { TasksModule } from './tasks/tasks.module';
import { FileModule } from './file/file.module';
import { MergeRequestModule } from './merge-request/merge-request.module';
import { MailModule } from './mail/mail.module';
import { UtilsModule } from './utils/utils.module';


@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    TestModule,
    LobbyModule,
    TasksModule,
    FileModule,
    MergeRequestModule,
    MailModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

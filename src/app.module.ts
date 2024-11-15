import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TestModule } from './test/test.module';
import { LobbyModule } from './lobby/lobby.module';
import { TasksModule } from './tasks/tasks.module';
import { FileModule } from './file/file.module';


@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    TestModule,
    LobbyModule,
    TasksModule,
    FileModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

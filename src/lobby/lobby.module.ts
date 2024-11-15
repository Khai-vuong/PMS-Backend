import { Module } from '@nestjs/common';
import { LobbyController } from './lobby.controller';
import { LobbyService } from './lobby.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [LobbyController],
  providers: [LobbyService, PrismaService, AuthService]
})
export class LobbyModule {}

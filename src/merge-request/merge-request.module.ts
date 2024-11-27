import { Module } from '@nestjs/common';
import { MergeRequestService } from './merge-request.service';
import { MergeRequestController } from './merge-request.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [MergeRequestController],
  providers: [MergeRequestService, PrismaService, AuthService],
  exports: [MergeRequestService],
})
export class MergeRequestModule {}

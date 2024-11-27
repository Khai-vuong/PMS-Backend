import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [MailController],
  providers: [MailService, PrismaService, AuthService]
})
export class MailModule {}

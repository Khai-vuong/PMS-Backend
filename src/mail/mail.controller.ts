import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { GetUserID } from 'src/utils/get-user.decorator';
import { LocalGuard } from 'src/utils/local.guard';

@Controller('mail')
export class MailController {
    constructor(private readonly MailService: MailService) {};
    @UseGuards(LocalGuard)
    @Get('init')
    async initMail(@GetUserID() user: any) {
        return this.MailService.initMail(user.userID);
    }
    @UseGuards(LocalGuard)
    @Get()
    async getMail(@Query('page') page: string, @Query('pageSize') pageSize: string, @GetUserID() user: any) {
        return this.MailService.getMail(page, pageSize, user.userID);
    }
}

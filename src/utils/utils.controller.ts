import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { GetUserID } from './get-user.decorator';
import { UtilsService } from './utils.service';

@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @UseGuards(LocalGuard)
  @Get('username')
  async getUsername(@GetUserID() user: any) {
    return user.username;
  }

  @UseGuards(LocalGuard)
  @Get('member')
  async getMember(@Query('pid') pid: string) {
    return this.utilsService.getMember(pid);
  }
}

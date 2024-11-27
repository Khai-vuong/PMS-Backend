import { Controller, Post, Body, Query, UseGuards, Get } from '@nestjs/common';
import { MergeRequestService } from './merge-request.service';
import { GetUserID } from 'src/utils/get-user.decorator';
import { LocalGuard } from 'src/utils/local.guard';

@Controller('mr')
export class MergeRequestController {
  constructor(private readonly mergeRequestService: MergeRequestService) {}

  @UseGuards(LocalGuard)
  @Post('create')
  async create(
    @Body('comment') comment: string,
    @Query() q: { tid: string; approver_uid: string },
    @GetUserID() user: any,
  ) {
    return this.mergeRequestService.create(
      q.tid,
      q.approver_uid ? q.approver_uid : 'ni',
      comment,
      user.userID,
    );
  }

  @UseGuards(LocalGuard)
  @Get('get-info')
  async getMergeRequestInfo(@Query('mrid') mrid: string) {
    return this.mergeRequestService.getMergeRequestInfo(mrid);
  }

  @UseGuards(LocalGuard)
  @Post('approve')
  async approve(@Query('mrid') mrid: string, @GetUserID() user: any) {
    return this.mergeRequestService.approve(mrid, user.userID);
  }

  @UseGuards(LocalGuard)
  @Post('reject')
  async reject(@Query('mrid') mrid: string, @GetUserID() user: any) {
    return this.mergeRequestService.reject(mrid, user.userID);
  }
}

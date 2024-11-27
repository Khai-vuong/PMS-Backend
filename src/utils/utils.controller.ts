import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalGuard } from './local.guard';
import { GetUserID } from './get-user.decorator';

@Controller('utils')
export class UtilsController {

    @UseGuards(LocalGuard)
    @Get('username')
    async getUsername(@GetUserID() user: any) {
        return user.username;
    }

}

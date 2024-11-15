import { BadRequestException, Body, Controller, Get, Param, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { IsManagerGuard } from 'src/is-manager/is-manager.guard';
import { GetUserID } from 'src/utils/get-user.decorator';
import { LocalGuard } from 'src/utils/local.guard';

@Controller('lobby')
export class LobbyController {
    constructor(private readonly lobbyService: LobbyService) { };
    @UseGuards(LocalGuard)
    @Get('init')
    async initLobby(@Query('pid') pid: string, @GetUserID() user: any) {
        if (!pid) { throw new BadRequestException('Project ID is required'); }

        return this.lobbyService.initLobby(pid, user.userID);
    }

    @UseGuards(LocalGuard)
    @Get('tasks')
    async getTasks(@Query('pid') pid: string,
        @Query('page') page: string,
        @Query('pageSize') pageSize: string, @GetUserID() user: any) {
        if (!pid) { throw new BadRequestException('Project ID is required'); }
        if (!page) { throw new BadRequestException('Page is required'); }
        if (!pageSize) { throw new BadRequestException('Page Size is required'); }

        return this.lobbyService.getTasks(pid, page, pageSize, user.userID);
    }
}

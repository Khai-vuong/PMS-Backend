import { Body, Controller, Post, Request, Response, UseGuards, Session, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/utils/local.guard';
import { GetUserID } from 'src/utils/get-user.decorator';
import { LoginDTO } from 'DTOs/Login.dto';
import { LoginReturnDTO } from 'DTOs/LoginReturn.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() input: LoginDTO): Promise<LoginReturnDTO> {
        const user = await this.authService.validateUser(input);
        return user;
    }

    //Copies from Son
    @Post('signup')
    async signup(@Body(ValidationPipe) user: LoginDTO): Promise<User> {
        return this.authService.signup(user);
    }

    @UseGuards(LocalGuard)
    @Post('test')
    async test(@GetUserID() userID) {
        return { userID: userID }
    }
}

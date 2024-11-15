import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { LoginReturnDTO } from 'DTOs/LoginReturn.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDTO } from 'DTOs/Login.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    //Copied logic from Tuan
    async validateUser(data: LoginDTO): Promise<LoginReturnDTO> {
        const user = await this.prisma.user.findUnique({
            where: {
                username: data.username
            }
        });

        if (!user) {
            throw new HttpException({ message: "Account is not exist" }, HttpStatus.UNAUTHORIZED)
        }

        const verifyPassword = data.password === user.password

        if (!verifyPassword) {
            throw new HttpException({ message: "Password is incorrect" }, HttpStatus.UNAUTHORIZED)
        }

        return await this.signin(user);
    }

    async signin(user: User): Promise<LoginReturnDTO> {
        const payload = {       //Sign payload
            sub: user.uid,
            username: user.username,
        };

        const jwttoken = await this.jwtService.signAsync(payload);
        return {
            userID: user.uid,
            username: user.username,
            token: jwttoken
        }
    }

    //Copied from Son
    async signup(createUser: LoginDTO): Promise<User> {
        const existedUser = await this.prisma.user.findUnique({ where: { username: createUser.username } });
        if (existedUser) {
            throw new NotFoundException("Username already exists");
        }
        return this.prisma.user.create({
            data: {
                username: createUser.username,
                password: createUser.password,
                email: ""
            },
        });
    }
}

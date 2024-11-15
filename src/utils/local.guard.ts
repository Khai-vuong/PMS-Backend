import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LocalGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization; //Get Bearer token
        const token = authorization?.split(' ')[1]; //Get token

        if (!token) {
            throw new UnauthorizedException();
        }

        try {       //Unpack payload   
            const payload = await this.jwtService.verifyAsync(token);
            request.user = {
                userID: payload.sub,
                username: payload.username
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }

    }
}
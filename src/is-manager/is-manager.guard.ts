import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
// import { Observable } from 'rxjs';

@Injectable()
export class IsManagerGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; //Get Bearer token
    const token = authorization?.split(' ')[1]; //Get token
    if (!token) {
      return false;
    }
    try {       //Unpack payload   
      const payload = await this.jwtService.verifyAsync(token);
      request.user = {
        userID: payload.sub,
        username: payload.username
      }

      const project = await this.prisma.project.findUnique({
        where: { pid: request.query.pid },
        include: { manager_ids: true },
      });

      if (!project) { throw new BadRequestException('Cannot find this project'); }
      const Mlist = project.manager_ids

      const isManager = Mlist.some((manager) => manager.uid === request.user.userID);
      return isManager;

    } catch (error) {
      console.error('Authorization error:', error);
      throw new UnauthorizedException('You are not the manager of this project');
    }
  }
}

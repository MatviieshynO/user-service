import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '../../core/config/config.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { RedisService } from '../../core/redis/redis.service';
import { RequestWithUser } from '../../types/request-with-user.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    const isBlacklisted = await this.redisService.isTokenBlacklisted(token);

    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    request.user = this.jwtService.verifyToken(
      token,
      this.configService.get('JWT_ACCESS_SECRET'),
    );

    request.accessToken = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  }
}

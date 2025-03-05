import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '../../core/config/config.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { LoggerService } from '../../core/logger/logger.service';
import { JwtPayload } from './guards.interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    request.user = this.jwtService.verifyToken(
      token,
      this.configService.get('JWT_ACCESS_SECRET'),
    );

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  }
}

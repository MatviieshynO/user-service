import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  JsonWebTokenError,
  JwtService as NestJwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from './../config/config.service';
import { JwtPayload } from './jwt.interfaces';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    const secretKey: string = secret ?? this.configService.get('JWT_DEFAULT_SECRET');
    return this.jwtService.sign(payload, { secret: secretKey, expiresIn });
  }

  verifyToken(token: string, secret: string): JwtPayload {
    try {
      const secretKey = secret ?? this.configService.get('JWT_DEFAULT_SECRET');
      const payload: JwtPayload = this.jwtService.verify(token, { secret: secretKey });
      if (payload) {
        return payload;
      }
      throw new UnauthorizedException('Invalid JWT token');
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Token has expired', 'JwtService');
        throw new UnauthorizedException('JWT token expired');
      } else if (error instanceof JsonWebTokenError) {
        this.logger.error('Invalid JWT token', error.message, 'JwtService');
        throw new UnauthorizedException('Invalid JWT token');
      } else if (error instanceof NotBeforeError) {
        this.logger.warn('JWT is not active yet', 'JwtService');
        throw new UnauthorizedException('JWT is not active yet');
      } else {
        this.logger.error(
          'Unknown token verification error',
          error instanceof Error ? error.message : String(error),
          'JwtService',
        );
        throw new UnauthorizedException('Invalid JWT token');
      }
    }
  }
  isValidToken(token: string, secret: string): boolean {
    try {
      this.jwtService.verify(token, { secret });
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}

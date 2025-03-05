import { Injectable } from '@nestjs/common';
import {
  JsonWebTokenError,
  JwtService as NestJwtService,
  NotBeforeError,
  TokenExpiredError,
} from '@nestjs/jwt';
import { LoggerService } from '../logger/logger.service';
import { ConfigService } from './../config/config.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly jwtDefoultSecret: string,
  ) {
    this.jwtDefoultSecret = this.configService.get('JWT_DEFAULT_SECRET');
  }

  generateToken(
    payload: Record<string, any>,
    secret: string,
    expiresIn: string,
  ): string {
    const secretKey: string = secret ?? this.jwtDefoultSecret;
    return this.jwtService.sign(payload, { secret: secretKey, expiresIn });
  }

  verifyToken(token: string, secret: string): Record<string, any> | null {
    try {
      const secretKey = secret ?? this.jwtDefoultSecret;
      return this.jwtService.verify(token, { secret: secretKey });
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Token has expired', 'JwtService');
      } else if (error instanceof JsonWebTokenError) {
        this.logger.error('Invalid JWT token', error.message, 'JwtService');
      } else if (error instanceof NotBeforeError) {
        this.logger.warn('JWT is not active yet', 'JwtService');
      } else {
        this.logger.error(
          'Unknown token verification error',
          error instanceof Error ? error.message : String(error),
          'JwtService',
        );
      }
      return null;
    }
  }
}

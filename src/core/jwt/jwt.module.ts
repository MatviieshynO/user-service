import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { JwtService } from './jwt.service';

@Global()
@Module({
  imports: [NestJwtModule.register({}), LoggerModule, ConfigModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}

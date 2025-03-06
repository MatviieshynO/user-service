import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { LoggerService } from './logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LoggerService, ConfigService],
  exports: [LoggerService],
})
export class LoggerModule {}

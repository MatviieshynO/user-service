import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { JwtModule } from '../../core/jwt/jwt.module';
import { LoggerModule } from '../../core/logger/logger.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [ConfigModule, JwtModule, LoggerModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class GuardsModule {}

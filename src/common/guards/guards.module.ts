import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { JwtModule } from '../../core/jwt/jwt.module';
import { LoggerModule } from '../../core/logger/logger.module';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [ConfigModule, JwtModule, LoggerModule],
  providers: [JwtAuthGuard, RolesGuard],
  exports: [JwtAuthGuard, RolesGuard],
})
export class GuardsModule {}

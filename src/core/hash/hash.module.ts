import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { HashService } from './hash.service';

@Module({
  imports: [ConfigModule],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}

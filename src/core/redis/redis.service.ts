import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '../config/config.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(
    private configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });

    this.client.on('error', (err) => console.error('Redis Error:', err));
  }

  async onModuleInit() {
    await this.client.connect();
    this.logger.log('Connected to Redis');
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.client.get(`blacklist:${token}`);
    return result !== null;
  }

  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await this.client.set(`blacklist:${token}`, 'true', { EX: expiresIn });
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log(' Disconnected from Redis');
  }
}

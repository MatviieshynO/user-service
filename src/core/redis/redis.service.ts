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

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async delete(key: string) {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log(' Disconnected from Redis');
  }
}

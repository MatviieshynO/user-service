import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service'; // Імпортуємо твій LoggerService

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: LoggerService) {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log(' Connected to the database', 'PrismaService');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Disconnected from the database', 'PrismaService');
  }
}

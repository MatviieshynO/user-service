import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const port = configService.get('PORT');

  logger.log(
    `The server has started successfully on port: ${port}`,
    'bootstrap',
  );

  await app.listen(port);
}
bootstrap();

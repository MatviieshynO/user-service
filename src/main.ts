import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Inject ConfigService
  const configService = app.get(ConfigService);

  // Get  port from .env
  const port = configService.get('port');

  // Start server
  await app.listen(port);
}
bootstrap();

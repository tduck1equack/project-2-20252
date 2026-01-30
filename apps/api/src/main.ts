import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from '@repo/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.API_PORT);
  console.log(`🚀 API running on http://localhost:${env.API_PORT}`);
}
bootstrap();

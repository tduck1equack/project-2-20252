import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { env } from '@repo/config';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser for refresh tokens
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS for web and docs apps
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // OpenAPI/Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Project-2 ERP API')
    .setDescription(`
## Overview
Enterprise Resource Planning API for inventory management, accounting, and e-invoicing.

## Modules
- **Auth** - JWT authentication and user management
- **Inventory** - Warehouse, stock movements, batches
- **Catalog** - Products and categories
- **Accounting** - VAS-compliant ledger and journal entries
- **E-Invoice** - Electronic invoice generation
    `)
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication and authorization')
    .addTag('Inventory', 'Stock and warehouse management')
    .addTag('Catalog', 'Product catalog management')
    .addTag('Accounting', 'Financial accounting (VAS)')
    .addTag('E-Invoice', 'Electronic invoicing')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve OpenAPI JSON at /api-json
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: '/api-json',
  });

  await app.listen(env.API_PORT);
  console.log(`🚀 API running on http://localhost:${env.API_PORT}`);
  console.log(`📚 API Docs available at http://localhost:${env.API_PORT}/api`);
}
bootstrap();

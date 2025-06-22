/**
 * @file main.ts
 * @description Bootstrap function for SouqSyria API backend. Configures Swagger for API documentation.
 */

import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeFirebase } from './config/firebase.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { AuditLogService } from './audit-log/service/audit-log.service';

async function bootstrap() {
  initializeFirebase();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api');
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);
  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('SouqSyria API')
    .setDescription(
      'Backend API Documentation for SouqSyria E-commerce Platform',
    )
    .setVersion('1.0')
    .addBearerAuth() // 🔒 Add Authorization Bearer Token (JWT)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Access at /api/docs
// ... logging...
  const auditLogService = app.get(AuditLogService);
  app.useGlobalInterceptors(
    new AuditInterceptor(auditLogService, app.get(Reflector)),
  );

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);


}
bootstrap();

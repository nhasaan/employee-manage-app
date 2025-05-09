import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Frontend development server
      'https://yourdomain.com', // Production frontend domain (if applicable)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Compression middleware
  app.use(compression());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription('Comprehensive API for Employee Management System')
    .setVersion('1.0')
    .addTag('employees', 'Employee-related operations')
    .addTag('departments', 'Department-related operations')
    .addBearerAuth() // If you plan to add authentication later
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Get port from environment or use default
  const port = process.env.PORT || 8000;

  // Start the server
  await app.listen(port, () => {
    console.log(`
    ================================================
      🚀 Server running on port: ${port}
      🌐 API Documentation: http://localhost:${port}/api-docs
      📊 Environment: ${process.env.NODE_ENV || 'development'}
    ================================================
    `);
  });
}

bootstrap().catch(console.error);

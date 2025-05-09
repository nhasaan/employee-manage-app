"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://yourdomain.com',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true,
    });
    app.use(compression());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Employee Management API')
        .setDescription('Comprehensive API for Employee Management System')
        .setVersion('1.0')
        .addTag('employees', 'Employee-related operations')
        .addTag('departments', 'Department-related operations')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    const port = process.env.PORT || 8000;
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
//# sourceMappingURL=main.js.map
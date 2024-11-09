import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up Swagger
  const options = new DocumentBuilder()
    .setTitle('user_management')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth') // Optional, you can add tags for organization
    .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/doc', app, document);  // Set '/api' as the endpoint for Swagger UI

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

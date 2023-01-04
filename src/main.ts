import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cors
  app.enableCors();

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe())

  // Open API
  const config = new DocumentBuilder()
    .addSecurity('bearer', {type: 'http', scheme: 'bearer'})
    .setTitle('Base Project')
    .setDescription('A basic API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start API
  await app.listen(3000);
}
bootstrap();

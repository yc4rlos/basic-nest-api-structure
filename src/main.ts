import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import helmet from 'helmet';
import { config as configuration } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet
  app.use(helmet());

  // Cors
  app.enableCors();

  // Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

  // Global Pipes
  app.useGlobalPipes(new ValidationPipe())

  // Open API
  const config = new DocumentBuilder()
    .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
    .setTitle('Base Project')
    .setDescription('A basic API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start API
  await app.listen(configuration().apiPort);
}
bootstrap();

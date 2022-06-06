import * as dotenv from 'dotenv';
dotenv.config();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
// import rawBodyMiddleware from './rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // app.use(rawBodyMiddleware());

  app.setGlobalPrefix('api');

  app.enableCors({});
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('vuleshopbee-api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8081);
}
bootstrap();

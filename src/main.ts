import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { createWinstonLoggerService } from './utils/winston.logger';
import { HttpExceptionFilter } from './utils/handlers/exception.handler';
import { ResponseInterceptor } from './utils/handlers/success.handler';
import { useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLoggerService(),
  });
  const PORT = process.env.PORT ?? 3000;
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use(helmet());

  // swagger module
  const config = new DocumentBuilder()
    .setTitle('LMS APIs Documentation')
    .setDescription('Learning Management System by Digiaccel')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // global exception interceptor
  app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(PORT, () => console.log('LMS application is up on:', PORT));
}
bootstrap();

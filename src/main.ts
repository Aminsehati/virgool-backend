import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './lib/interceptors/response.interceptor';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  })

  app.useGlobalInterceptors(new ResponseInterceptor());



  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );


  app.setGlobalPrefix('/api/v1');

  const COOKIE_SECRET = process.env.COOKIE_SECRET ;

  app.use(cookieParser(COOKIE_SECRET));
  const port = process.env.PORT || 3000;


  setupSwagger(app)


  await app.listen(port);
}
bootstrap();
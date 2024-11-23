import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  // 앱 전체에 파이프를넣고 validation 어노테이션을 실행시키게 해준다.

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

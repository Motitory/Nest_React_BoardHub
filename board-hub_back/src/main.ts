import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

dotenv.config();
async function bootstrap() {
  const server = express();
  server.use('/uploads', express.static('uploads')); // 정적 파일 제공 설정
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  // const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // 특정 출처 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  await app.listen(8000);
}
bootstrap();

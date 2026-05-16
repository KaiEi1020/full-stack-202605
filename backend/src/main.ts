import 'reflect-metadata';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const storageDir =
    process.env.STORAGE_DIR ?? resolve(process.cwd(), '..', 'storage');

  app.enableCors({ origin: true });
  app.use('/storage', express.static(storageDir));
  await app.listen(port, '0.0.0.0');
}

void bootstrap();

import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { join, resolve } from 'node:path';
import { AppModule } from './app.module';

loadEnv({ path: join(process.cwd(), '.env') });

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

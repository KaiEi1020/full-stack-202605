import { join, resolve } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JobRequirementEntity } from './job-requirement.entity';
import { ResumeEntity } from './resume.entity';
import { UserEntity } from './user.entity';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  const databasePath = process.env.SQLITE_DATABASE_PATH ?? resolve(process.cwd(), 'data.sqlite');

  return {
    type: 'better-sqlite3',
    database: databasePath,
    entities: [UserEntity, ResumeEntity, JobRequirementEntity],
    synchronize: true,
    logging: false,
  };
}

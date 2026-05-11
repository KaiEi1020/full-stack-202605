import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JobRequirementEntity } from './job-requirement.entity';
import { ResumeEntity } from './resume.entity';
import { UserEntity } from './user.entity';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  const databasePath =
    process.env.SQLITE_DATABASE_PATH ?? resolve(process.cwd(), 'data.sqlite');

  return {
    type: 'sqljs',
    location: databasePath,
    autoSave: true,
    autoSaveCallback: (data) => {
      require('node:fs').writeFileSync(databasePath, Buffer.from(data));
    },
    database: loadDatabase(databasePath),
    entities: [UserEntity, ResumeEntity, JobRequirementEntity],
    synchronize: true,
    logging: false,
  };
}

function loadDatabase(databasePath: string) {
  try {
    return new Uint8Array(readFileSync(databasePath));
  } catch {
    return undefined;
  }
}

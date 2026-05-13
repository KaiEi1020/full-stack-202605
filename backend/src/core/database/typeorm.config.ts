import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JobRequirementEntity } from '../../modules/candidate/entities/job-requirement.entity';
import { ResumeEntity } from '../../modules/candidate/entities/resume.entity';
import { UserEntity } from '../../modules/user/infrastructure/persistence/entities/user.entity';

export function createTypeOrmOptions(): TypeOrmModuleOptions {
  const databasePath =
    process.env.SQLITE_DATABASE_PATH ?? resolve(process.cwd(), 'data.sqlite');

  return {
    type: 'sqljs',
    location: databasePath,
    autoSave: true,
    autoSaveCallback: (data) => {
      writeFileSync(databasePath, Buffer.from(data));
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

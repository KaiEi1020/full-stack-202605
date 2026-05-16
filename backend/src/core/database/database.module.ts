import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { createMikroOrmConfig } from './mikro-orm.config';

@Global()
@Module({
  imports: [
    ConfigModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...createMikroOrmConfig({
          host: config.get<string>('DATABASE_HOST') ?? 'localhost',
          port: Number(config.get<string>('DATABASE_PORT') ?? '5432'),
          user: config.get<string>('DATABASE_USER') ?? 'postgres',
          password: config.get<string>('DATABASE_PASSWORD') ?? '',
          dbName: config.get<string>('DATABASE_NAME') ?? 'app_db',
          debug: config.get<string>('NODE_ENV') !== 'production',
        }),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}

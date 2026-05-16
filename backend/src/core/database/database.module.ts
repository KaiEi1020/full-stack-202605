import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRoot({
      driver: PostgreSqlDriver,
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      user: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? '',
      dbName: process.env.DATABASE_NAME ?? 'app_db',
      debug: process.env.NODE_ENV !== 'production',
      metadataProvider: ReflectMetadataProvider,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}

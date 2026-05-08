import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigModelModule } from './bigmodel/bigmodel.module';
import { CandidateModule } from './candidate/candidate.module';
import { PdfModule } from './pdf/pdf.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResumeUploadModule } from './resume-upload/resume-upload.module';
import { ScreeningModule } from './screening/screening.module';
import { StorageModule } from './storage/storage.module';
import { SseModule } from './sse/sse.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.GRAPHQL_SCHEMA_PATH ?? join(process.cwd(), 'schema.gql'),
      playground: true,
    }),
    PrismaModule,
    StorageModule,
    SseModule,
    PdfModule,
    BigModelModule,
    ScreeningModule,
    ResumeUploadModule,
    CandidateModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

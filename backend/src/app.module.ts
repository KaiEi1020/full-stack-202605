import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigModelModule } from './bigmodel/bigmodel.module';
import { CandidateModule } from './candidate/candidate.module';
import { DatabaseModule } from './database/database.module';
import { createTypeOrmOptions } from './database/typeorm.config';
import { PdfModule } from './pdf/pdf.module';
import { ResumeUploadModule } from './resume-upload/resume-upload.module';
import { ScreeningModule } from './screening/screening.module';
import { StorageModule } from './storage/storage.module';
import { SseModule } from './sse/sse.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(createTypeOrmOptions()),
    DatabaseModule,
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

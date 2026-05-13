import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BigModelModule } from './core/bigmodel/bigmodel.module';
import { DatabaseModule } from './core/database/database.module';
import { createTypeOrmOptions } from './core/database/typeorm.config';
import { PdfModule } from './core/pdf/pdf.module';
import { StorageModule } from './core/storage/storage.module';
import { SseModule } from './core/sse/sse.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { ResumeUploadModule } from './modules/resume-upload/resume-upload.module';
import { ScreeningModule } from './modules/screening/screening.module';
import { UserModule } from './modules/user/user.module';

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

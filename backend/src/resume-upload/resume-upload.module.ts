import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from '../database';
import { ScreeningModule } from '../screening/screening.module';
import { ResumeUploadController } from './resume-upload.controller';
import { ResumeUploadService } from './resume-upload.service';

@Module({
  imports: [ScreeningModule, TypeOrmModule.forFeature([ResumeEntity])],
  controllers: [ResumeUploadController],
  providers: [ResumeUploadService],
})
export class ResumeUploadModule {}

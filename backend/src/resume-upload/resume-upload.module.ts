import { Module } from '@nestjs/common';
import { ScreeningModule } from '../screening/screening.module';
import { ResumeUploadController } from './resume-upload.controller';
import { ResumeUploadService } from './resume-upload.service';

@Module({
  imports: [ScreeningModule],
  controllers: [ResumeUploadController],
  providers: [ResumeUploadService],
})
export class ResumeUploadModule {}

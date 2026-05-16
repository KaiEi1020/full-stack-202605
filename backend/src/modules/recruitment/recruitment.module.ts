import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BigModelModule } from '../../core/bigmodel/bigmodel.module';
import { StorageModule } from '../../core/storage/storage.module';
import { ResumeEntity } from './domain/entity/resume.entity';
import { JobApplicationEntity, JobEntity } from './domain/entity';
import { RecruitmentController } from './api/controller/recruitment.controller';
import { RecruitmentService } from './application/service/recruitment.service';
import { ResumesController } from './api/controller/resumes.controller';
import { RecruitmentScreeningModule } from './infrastructure/external/recruitment-screening.module';
import { JobApplicationUploadService } from './application/service/job-application-upload.service';

@Module({
  imports: [
    BigModelModule,
    StorageModule,
    forwardRef(() => RecruitmentScreeningModule),
    TypeOrmModule.forFeature([ResumeEntity, JobEntity, JobApplicationEntity]),
  ],
  controllers: [RecruitmentController, ResumesController],
  providers: [RecruitmentService, JobApplicationUploadService],
  exports: [RecruitmentService, JobApplicationUploadService],
})
export class RecruitmentModule {}

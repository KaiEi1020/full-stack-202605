import { Module, forwardRef } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BigModelModule } from '../../core/bigmodel/bigmodel.module';
import { StorageModule } from '../../core/storage/storage.module';
import { ResumeEntity } from './infrastructure/persistence/entities/resume.entity';
import { JobEntity } from './infrastructure/persistence/entities/job.entity';
import { JobApplicationEntity } from './infrastructure/persistence/entities/job-application.entity';
import { RecruitmentController } from './api/controller/recruitment.controller';
import { RecruitmentService } from './application/service/recruitment.service';
import { ResumesController } from './api/controller/resumes.controller';
import { RecruitmentScreeningModule } from './infrastructure/external/recruitment-screening.module';
import { JobApplicationUploadService } from './application/service/job-application-upload.service';
import { RESUME_REPOSITORY } from './domain/repository/resume.repository';
import { JOB_REPOSITORY } from './domain/repository/job.repository';
import { JOB_APPLICATION_REPOSITORY } from './domain/repository/job-application.repository';
import { MikroOrmResumeRepository } from './infrastructure/repositories/mikroorm-resume.repository';
import { MikroOrmJobRepository } from './infrastructure/repositories/mikroorm-job.repository';
import { MikroOrmJobApplicationRepository } from './infrastructure/repositories/mikroorm-job-application.repository';

@Module({
  imports: [
    BigModelModule,
    StorageModule,
    forwardRef(() => RecruitmentScreeningModule),
    MikroOrmModule.forFeature([ResumeEntity, JobEntity, JobApplicationEntity]),
  ],
  controllers: [RecruitmentController, ResumesController],
  providers: [
    RecruitmentService,
    JobApplicationUploadService,
    MikroOrmResumeRepository,
    MikroOrmJobRepository,
    MikroOrmJobApplicationRepository,
    { provide: RESUME_REPOSITORY, useExisting: MikroOrmResumeRepository },
    { provide: JOB_REPOSITORY, useExisting: MikroOrmJobRepository },
    {
      provide: JOB_APPLICATION_REPOSITORY,
      useExisting: MikroOrmJobApplicationRepository,
    },
  ],
  exports: [RecruitmentService, JobApplicationUploadService],
})
export class RecruitmentModule {}

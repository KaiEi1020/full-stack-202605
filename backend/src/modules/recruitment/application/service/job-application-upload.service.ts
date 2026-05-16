import { Injectable } from '@nestjs/common';
import { FsStorageService } from '../../../../core/storage/fs-storage.service';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentScreeningOrchestratorService } from './recruitment-screening-orchestrator.service';
import { UploadedPdfFile } from './uploaded-pdf-file.type';

@Injectable()
export class JobApplicationUploadService {
  constructor(
    private readonly recruitmentService: RecruitmentService,
    private readonly fsStorageService: FsStorageService,
    private readonly screeningOrchestratorService: RecruitmentScreeningOrchestratorService,
  ) {}

  async uploadToJob(
    jobId: string,
    file: UploadedPdfFile,
    jdText?: string,
    requiredSkills: string[] = [],
    preferredSkills: string[] = [],
  ) {
    const stored = await this.fsStorageService.savePdf(
      file.originalname,
      file.buffer,
    );

    const created = await this.recruitmentService.createApplicationForUpload({
      jobId,
      file: {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        storagePath: stored.storagePath,
      },
      jdText,
      requiredSkills,
      preferredSkills,
    });

    void this.screeningOrchestratorService.run(
      created.resumeId,
      created.applicationId,
      file.buffer,
    );

    return created;
  }
}

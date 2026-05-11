import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CandidateStatus,
  JobStatus,
  ParseStatus,
  ResumeEntity,
} from '../database';
import { ScreeningOrchestratorService } from '../screening/screening-orchestrator.service';
import { FsStorageService } from '../storage/fs-storage.service';
import { UploadedPdfFile } from './uploaded-pdf-file.type';

@Injectable()
export class ResumeUploadService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    private readonly fsStorageService: FsStorageService,
    private readonly screeningOrchestratorService: ScreeningOrchestratorService,
  ) {}

  async upload(
    file: UploadedPdfFile,
    jdText?: string,
    requiredSkills: string[] = [],
    preferredSkills: string[] = [],
  ) {
    const resumeId = randomUUID();
    const jobId = randomUUID();
    const stored = await this.fsStorageService.savePdf(
      file.originalname,
      file.buffer,
    );

    await this.resumeRepository.save(
      this.resumeRepository.create({
        id: resumeId,
        status: CandidateStatus.PENDING,
        originalName: file.originalname,
        storagePath: stored.storagePath,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        parseStatus: ParseStatus.PENDING,
        screeningStatus: JobStatus.PENDING,
        screeningStage: 'uploaded',
        jdText: jdText ?? '通用岗位需求',
        requiredSkillsJson: JSON.stringify(requiredSkills),
        preferredSkillsJson: JSON.stringify(preferredSkills),
        eventHistoryJson: JSON.stringify([]),
        scoreHistoryJson: JSON.stringify([]),
      }),
    );

    void this.screeningOrchestratorService.run(resumeId, jobId, file.buffer);

    return { resumeId, candidateId: resumeId, jobId };
  }
}

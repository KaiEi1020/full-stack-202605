import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ScreeningOrchestratorService } from '../screening/screening-orchestrator.service';
import { FsStorageService } from '../storage/fs-storage.service';
import { UploadedPdfFile } from './uploaded-pdf-file.type';

@Injectable()
export class ResumeUploadService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fsStorageService: FsStorageService,
    private readonly screeningOrchestratorService: ScreeningOrchestratorService,
  ) {}

  async upload(file: UploadedPdfFile) {
    const candidateId = randomUUID();
    const jobId = randomUUID();
    const stored = await this.fsStorageService.savePdf(file.originalname, file.buffer);

    await this.prisma.candidate.create({
      data: {
        id: candidateId,
        status: 'PENDING',
      },
    });
    await this.prisma.resumeFile.create({
      data: {
        id: randomUUID(),
        candidateId,
        originalName: file.originalname,
        storagePath: stored.storagePath,
        mimeType: file.mimetype,
        sizeBytes: file.size,
      },
    });
    await this.prisma.screeningJob.create({
      data: {
        id: jobId,
        candidateId,
        jdText: '通用岗位需求',
        requiredSkillsJson: '[]',
        preferredSkillsJson: '[]',
        stage: 'uploaded',
      },
    });

    void this.screeningOrchestratorService.run(candidateId, jobId, file.buffer);

    return { candidateId, jobId };
  }
}

import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BigModelService } from '../bigmodel/bigmodel.service';
import { PdfParserService } from '../pdf/pdf-parser.service';
import { SseEventsService } from '../sse/sse-events.service';

@Injectable()
export class ScreeningOrchestratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pdfParserService: PdfParserService,
    private readonly bigModelService: BigModelService,
    private readonly sseEventsService: SseEventsService,
  ) {}

  async run(candidateId: string, jobId: string, fileBuffer: Buffer) {
    await this.prisma.screeningJob.update({ where: { id: jobId }, data: { status: 'RUNNING', stage: 'parsing', startedAt: new Date() } });
    await this.recordEvent(candidateId, jobId, 'started', 'parsing', { message: '开始解析简历' });
    try {
      const parsed = await this.pdfParserService.parse(fileBuffer);
      await this.prisma.resumeParse.upsert({
        where: { candidateId },
        update: { pageCount: parsed.pageCount, rawText: parsed.rawText, cleanedText: parsed.cleanedText, parseStatus: 'SUCCEEDED', parsedAt: new Date(), errorMessage: null },
        create: { id: randomUUID(), candidateId, pageCount: parsed.pageCount, rawText: parsed.rawText, cleanedText: parsed.cleanedText, parseStatus: 'SUCCEEDED', parsedAt: new Date() },
      });
      await this.recordEvent(candidateId, jobId, 'section', 'parsing', { pageCount: parsed.pageCount });

      await this.prisma.screeningJob.update({ where: { id: jobId }, data: { stage: 'extracting' } });
      await this.recordEvent(candidateId, jobId, 'started', 'extracting', { message: '开始提取结构化信息' });
      const extracted = await this.bigModelService.extractCandidateProfile(parsed.cleanedText);
      await this.prisma.candidate.update({
        where: { id: candidateId },
        data: {
          name: extracted.basicInfo.name,
          phone: extracted.basicInfo.phone,
          email: extracted.basicInfo.email,
          city: extracted.basicInfo.city,
          resumeSummary: parsed.cleanedText.slice(0, 400),
        },
      });
      await this.prisma.candidateExtraction.upsert({
        where: { candidateId },
        update: {
          basicInfoJson: JSON.stringify(extracted.basicInfo),
          educationJson: JSON.stringify(extracted.education),
          workExperienceJson: JSON.stringify(extracted.workExperience),
          skillsJson: JSON.stringify(extracted.skills),
          projectJson: JSON.stringify(extracted.projects),
          rawModelOutput: extracted.raw,
          extractedAt: new Date(),
        },
        create: {
          id: randomUUID(),
          candidateId,
          basicInfoJson: JSON.stringify(extracted.basicInfo),
          educationJson: JSON.stringify(extracted.education),
          workExperienceJson: JSON.stringify(extracted.workExperience),
          skillsJson: JSON.stringify(extracted.skills),
          projectJson: JSON.stringify(extracted.projects),
          rawModelOutput: extracted.raw,
        },
      });
      await this.recordEvent(candidateId, jobId, 'section', 'extracting', { basicInfo: extracted.basicInfo, skills: extracted.skills });

      await this.prisma.screeningJob.update({ where: { id: jobId }, data: { stage: 'scoring' } });
      await this.recordEvent(candidateId, jobId, 'started', 'scoring', { message: '开始岗位评分' });
      const score = await this.bigModelService.scoreCandidateAgainstJd(parsed.cleanedText, '通用岗位需求', [], []);
      await this.prisma.candidateScore.create({
        data: {
          id: randomUUID(),
          candidateId,
          jdText: '通用岗位需求',
          requiredSkillsJson: '[]',
          preferredSkillsJson: '[]',
          overallScore: score.overallScore,
          skillScore: score.skillScore,
          experienceScore: score.experienceScore,
          educationScore: score.educationScore,
          aiComment: score.aiComment,
        },
      });
      await this.recordEvent(candidateId, jobId, 'completed', 'scoring', { overallScore: score.overallScore, aiComment: score.aiComment });
      await this.prisma.candidate.update({ where: { id: candidateId }, data: { status: 'PASSED' } });
      await this.prisma.screeningJob.update({ where: { id: jobId }, data: { status: 'SUCCEEDED', stage: 'completed', finishedAt: new Date() } });
      await this.recordEvent(candidateId, jobId, 'completed', 'completed', { status: 'SUCCEEDED' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误';
      await this.prisma.candidate.update({ where: { id: candidateId }, data: { status: 'REJECTED' } });
      await this.prisma.screeningJob.update({ where: { id: jobId }, data: { status: 'FAILED', stage: 'failed', errorMessage: message, finishedAt: new Date() } });
      await this.recordEvent(candidateId, jobId, 'failed', 'failed', { message });
    }
  }

  private async recordEvent(candidateId: string, jobId: string, type: string, stage: string, payload: Record<string, unknown>) {
    const event = {
      id: randomUUID(),
      candidateId,
      jobId,
      type,
      stage,
      payloadJson: JSON.stringify(payload),
    };
    await this.prisma.screeningEvent.create({ data: event });
    this.sseEventsService.emit(candidateId, {
      id: event.id,
      candidateId,
      jobId,
      type,
      stage,
      payload,
      createdAt: new Date().toISOString(),
    });
  }
}

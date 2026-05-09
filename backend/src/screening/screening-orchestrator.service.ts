import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateStatus, JobStatus, ParseStatus, ResumeEntity } from '../database';
import { BigModelService } from '../bigmodel/bigmodel.service';
import { PdfParserService } from '../pdf/pdf-parser.service';
import { SseEventsService } from '../sse/sse-events.service';

@Injectable()
export class ScreeningOrchestratorService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    private readonly pdfParserService: PdfParserService,
    private readonly bigModelService: BigModelService,
    private readonly sseEventsService: SseEventsService,
  ) {}

  async run(resumeId: string, jobId: string, fileBuffer: Buffer) {
    const resume = await this.resumeRepository.findOneByOrFail({ id: resumeId });
    resume.screeningStatus = JobStatus.RUNNING;
    resume.screeningStage = 'parsing';
    resume.screeningStartedAt = new Date();
    await this.resumeRepository.save(resume);
    await this.recordEvent(resumeId, jobId, 'started', 'parsing', { message: '开始解析简历' });

    try {
      const parsed = await this.pdfParserService.parse(fileBuffer);
      resume.pageCount = parsed.pageCount;
      resume.rawText = parsed.rawText;
      resume.cleanedText = parsed.cleanedText;
      resume.parseStatus = ParseStatus.SUCCEEDED;
      resume.parsedAt = new Date();
      resume.parseErrorMessage = null;
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'section', 'parsing', { pageCount: parsed.pageCount });

      resume.screeningStage = 'extracting';
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'started', 'extracting', { message: '开始提取结构化信息' });

      const extracted = await this.bigModelService.extractCandidateProfile(parsed.cleanedText);
      resume.name = extracted.basicInfo.name;
      resume.phone = extracted.basicInfo.phone;
      resume.email = extracted.basicInfo.email;
      resume.city = extracted.basicInfo.city;
      resume.resumeSummary = parsed.cleanedText.slice(0, 400);
      resume.basicInfoJson = JSON.stringify(extracted.basicInfo);
      resume.educationJson = JSON.stringify(extracted.education);
      resume.workExperienceJson = JSON.stringify(extracted.workExperience);
      resume.skillsJson = JSON.stringify(extracted.skills);
      resume.projectJson = JSON.stringify(extracted.projects);
      resume.rawModelOutput = extracted.raw;
      resume.extractedAt = new Date();
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'section', 'extracting', { basicInfo: extracted.basicInfo, skills: extracted.skills });

      resume.screeningStage = 'scoring';
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'started', 'scoring', { message: '开始岗位评分' });

      const requiredSkills = this.parseJsonArray(resume.requiredSkillsJson);
      const preferredSkills = this.parseJsonArray(resume.preferredSkillsJson);
      const score = await this.bigModelService.scoreCandidateAgainstJd(parsed.cleanedText, resume.jdText ?? '通用岗位需求', requiredSkills, preferredSkills);
      const history = this.parseJsonArray(resume.scoreHistoryJson);
      history.unshift({
        id: randomUUID(),
        overallScore: score.overallScore,
        skillScore: score.skillScore,
        experienceScore: score.experienceScore,
        educationScore: score.educationScore,
        aiComment: score.aiComment,
        scoredAt: new Date().toISOString(),
      });
      resume.overallScore = score.overallScore;
      resume.skillScore = score.skillScore;
      resume.experienceScore = score.experienceScore;
      resume.educationScore = score.educationScore;
      resume.aiComment = score.aiComment;
      resume.scoreHistoryJson = JSON.stringify(history);
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'completed', 'scoring', { overallScore: score.overallScore, aiComment: score.aiComment });

      resume.status = CandidateStatus.PASSED;
      resume.screeningStatus = JobStatus.SUCCEEDED;
      resume.screeningStage = 'completed';
      resume.screeningFinishedAt = new Date();
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'completed', 'completed', { status: 'SUCCEEDED' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误';
      resume.status = CandidateStatus.REJECTED;
      resume.screeningStatus = JobStatus.FAILED;
      resume.screeningStage = 'failed';
      resume.screeningErrorMessage = message;
      resume.screeningFinishedAt = new Date();
      await this.resumeRepository.save(resume);
      await this.recordEvent(resumeId, jobId, 'failed', 'failed', { message });
    }
  }

  private async recordEvent(resumeId: string, jobId: string, type: string, stage: string, payload: Record<string, unknown>) {
    const resume = await this.resumeRepository.findOneByOrFail({ id: resumeId });
    const history = this.parseJsonArray(resume.eventHistoryJson);
    const event = {
      id: randomUUID(),
      candidateId: resumeId,
      resumeId,
      jobId,
      type,
      stage,
      payload,
      createdAt: new Date().toISOString(),
    };
    history.push(event);
    resume.eventHistoryJson = JSON.stringify(history);
    await this.resumeRepository.save(resume);
    this.sseEventsService.emit(resumeId, event);
  }

  private parseJsonArray(value: string | null) {
    if (!value) {
      return [];
    }
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BigModelService } from '../../../../core/bigmodel/bigmodel.service';
import { SubmissionStatus } from '../../domain/vo/submission-status.enum';
import { ResumeEntity } from '../../domain/entity/resume.entity';
import { ParseStatus } from '../../domain/vo/parse-status.enum';
import { ScreeningStatus } from '../../domain/vo/screening-status.enum';
import { JobApplicationEntity, JobEntity } from '../../domain/entity';

type ApplicationView = {
  id: string;
  jobId: string;
  resumeId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  status: SubmissionStatus;
  resumeSummary: string | null;
  resumeFilePath: string | null;
  cleanedText: string | null;
  parseStatus: ParseStatus;
  parseErrorMessage: string | null;
  screeningStatus: ScreeningStatus;
  screeningStage: string | null;
  screeningErrorMessage: string | null;
  skills: string[];
  scores: Array<Record<string, unknown>>;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(JobApplicationEntity)
    private readonly applicationRepository: Repository<JobApplicationEntity>,
    private readonly bigModelService: BigModelService,
  ) {}

  async createJob(input: {
    title: string;
    description: string;
    requiredSkills: string[];
    preferredSkills: string[];
    id?: string;
  }) {
    const entity = this.jobRepository.create({
      id: input.id ?? randomUUID(),
      title: input.title,
      description: input.description,
      requiredSkillsJson: JSON.stringify(input.requiredSkills),
      preferredSkillsJson: JSON.stringify(input.preferredSkills),
    });
    await this.jobRepository.save(entity);
    return this.toJobView(entity);
  }

  async listJobs() {
    const items = await this.jobRepository.find({
      order: { updatedAt: 'desc' },
    });
    return items.map((item) => this.toJobView(item));
  }

  async getJob(jobId: string) {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('岗位不存在');
    }
    return this.toJobView(job);
  }

  async createApplicationForUpload(input: {
    jobId: string;
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      storagePath: string;
    };
    jdText?: string;
    requiredSkills: string[];
    preferredSkills: string[];
  }) {
    const job = await this.jobRepository.findOne({
      where: { id: input.jobId },
    });
    if (!job) {
      throw new NotFoundException('岗位不存在');
    }

    if (
      input.jdText ||
      input.requiredSkills.length ||
      input.preferredSkills.length
    ) {
      job.description = input.jdText ?? job.description;
      job.requiredSkillsJson = JSON.stringify(
        input.requiredSkills.length
          ? input.requiredSkills
          : this.parseJsonArray(job.requiredSkillsJson),
      );
      job.preferredSkillsJson = JSON.stringify(
        input.preferredSkills.length
          ? input.preferredSkills
          : this.parseJsonArray(job.preferredSkillsJson),
      );
      await this.jobRepository.save(job);
    }

    const resumeId = randomUUID();
    const applicationId = randomUUID();
    await this.resumeRepository.save(
      this.resumeRepository.create({
        id: resumeId,
        originalName: input.file.originalname,
        storagePath: input.file.storagePath,
        mimeType: input.file.mimetype,
        sizeBytes: input.file.size,
        parseStatus: ParseStatus.PENDING,
      }),
    );

    const application = this.applicationRepository.create({
      id: applicationId,
      jobId: job.id,
      resumeId,
      status: SubmissionStatus.PENDING,
      screeningStatus: ScreeningStatus.PENDING,
      screeningStage: 'uploaded',
      eventHistoryJson: JSON.stringify([]),
      scoreHistoryJson: JSON.stringify([]),
    });
    await this.applicationRepository.save(application);

    return {
      applicationId,
      jobId: job.id,
      resumeId,
    };
  }

  async listApplications() {
    const [applications, resumes] = await Promise.all([
      this.applicationRepository.find({ order: { createdAt: 'desc' } }),
      this.resumeRepository.find(),
    ]);
    const resumeById = new Map(resumes.map((item) => [item.id, item]));
    return applications.map((application) =>
      this.toApplicationView(
        application,
        resumeById.get(application.resumeId) ?? null,
      ),
    );
  }

  async getApplicationView(applicationId: string) {
    const application = await this.getApplicationOrThrow(applicationId);
    const resume = await this.getResumeOrThrow(application.resumeId);
    return this.toApplicationView(application, resume);
  }

  async getApplicationOrThrow(applicationId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
    });
    if (!application) {
      throw new NotFoundException('投递不存在');
    }
    return application;
  }

  async getResumeOrThrow(resumeId: string) {
    return this.resumeRepository.findOneByOrFail({ id: resumeId });
  }

  async markParsingStarted(applicationId: string, resumeId: string) {
    const [application, resume] = await Promise.all([
      this.getApplicationOrThrow(applicationId),
      this.getResumeOrThrow(resumeId),
    ]);
    application.screeningStatus = ScreeningStatus.RUNNING;
    application.screeningStage = 'parsing';
    application.screeningStartedAt = new Date();
    resume.parseStatus = ParseStatus.PENDING;
    await Promise.all([
      this.applicationRepository.save(application),
      this.resumeRepository.save(resume),
    ]);
  }

  async saveParsedResume(
    applicationId: string,
    resumeId: string,
    parsed: { pageCount: number; rawText: string; cleanedText: string },
  ) {
    const [application, resume] = await Promise.all([
      this.getApplicationOrThrow(applicationId),
      this.getResumeOrThrow(resumeId),
    ]);
    resume.pageCount = parsed.pageCount;
    resume.rawText = parsed.rawText;
    resume.cleanedText = parsed.cleanedText;
    resume.parseStatus = ParseStatus.SUCCEEDED;
    resume.parsedAt = new Date();
    resume.parseErrorMessage = null;
    application.screeningStage = 'extracting';
    await Promise.all([
      this.applicationRepository.save(application),
      this.resumeRepository.save(resume),
    ]);
  }

  async saveExtractedProfile(
    applicationId: string,
    resumeId: string,
    input: {
      cleanedText: string;
      basicInfo: Record<string, string | null>;
      education: unknown[];
      workExperience: unknown[];
      skills: unknown[];
      projects: unknown[];
      raw: string;
    },
  ) {
    const [application, resume] = await Promise.all([
      this.getApplicationOrThrow(applicationId),
      this.getResumeOrThrow(resumeId),
    ]);
    resume.name = input.basicInfo.name ?? null;
    resume.phone = input.basicInfo.phone ?? null;
    resume.email = input.basicInfo.email ?? null;
    resume.city = input.basicInfo.city ?? null;
    resume.resumeSummary = input.cleanedText.slice(0, 400);
    resume.basicInfoJson = JSON.stringify(input.basicInfo);
    resume.educationJson = JSON.stringify(input.education);
    resume.workExperienceJson = JSON.stringify(input.workExperience);
    resume.skillsJson = JSON.stringify(input.skills);
    resume.projectJson = JSON.stringify(input.projects);
    resume.rawModelOutput = input.raw;
    resume.extractedAt = new Date();
    application.screeningStage = 'scoring';
    await Promise.all([
      this.applicationRepository.save(application),
      this.resumeRepository.save(resume),
    ]);
  }

  async saveApplicationScore(applicationId: string, resumeId: string) {
    const [application, resume, job] = await Promise.all([
      this.getApplicationOrThrow(applicationId),
      this.getResumeOrThrow(resumeId),
      this.getJobForApplication(applicationId),
    ]);
    if (!resume.cleanedText) {
      throw new NotFoundException('简历或解析结果不存在');
    }

    const requiredSkills = this.parseJsonArray<string>(job.requiredSkillsJson);
    const preferredSkills = this.parseJsonArray<string>(
      job.preferredSkillsJson,
    );
    const result = await this.bigModelService.scoreCandidateAgainstJd(
      resume.cleanedText,
      job.description,
      requiredSkills,
      preferredSkills,
    );
    const history = this.parseJsonArray<Record<string, unknown>>(
      application.scoreHistoryJson,
    );
    history.unshift({
      id: randomUUID(),
      overallScore: result.overallScore,
      skillScore: result.skillScore,
      experienceScore: result.experienceScore,
      educationScore: result.educationScore,
      aiComment: result.aiComment,
      scoredAt: new Date().toISOString(),
      jobId: job.id,
      requiredSkills,
      preferredSkills,
    });
    application.overallScore = result.overallScore;
    application.skillScore = result.skillScore;
    application.experienceScore = result.experienceScore;
    application.educationScore = result.educationScore;
    application.aiComment = result.aiComment;
    application.scoreHistoryJson = JSON.stringify(history);
    application.status = SubmissionStatus.PASSED;
    application.screeningStatus = ScreeningStatus.SUCCEEDED;
    application.screeningStage = 'completed';
    application.screeningFinishedAt = new Date();
    await this.applicationRepository.save(application);
  }

  async markScreeningFailed(
    applicationId: string,
    resumeId: string,
    message: string,
  ) {
    const [application, resume] = await Promise.all([
      this.getApplicationOrThrow(applicationId),
      this.getResumeOrThrow(resumeId),
    ]);
    application.status = SubmissionStatus.REJECTED;
    application.screeningStatus = ScreeningStatus.FAILED;
    application.screeningStage = 'failed';
    application.screeningErrorMessage = message;
    application.screeningFinishedAt = new Date();
    resume.parseStatus = ParseStatus.FAILED;
    resume.parseErrorMessage = message;
    await Promise.all([
      this.applicationRepository.save(application),
      this.resumeRepository.save(resume),
    ]);
  }

  async appendApplicationEvent(
    applicationId: string,
    resumeId: string,
    type: string,
    stage: string,
    payload: Record<string, unknown>,
  ) {
    const application = await this.getApplicationOrThrow(applicationId);
    const event = {
      id: randomUUID(),
      candidateId: applicationId,
      resumeId,
      jobId: application.jobId,
      type,
      stage,
      payload,
      createdAt: new Date().toISOString(),
    };
    const history = this.parseJsonArray<Record<string, unknown>>(
      application.eventHistoryJson,
    );
    history.push(event);
    application.eventHistoryJson = JSON.stringify(history);
    await this.applicationRepository.save(application);
    return event;
  }

  async updateApplicationStatus(applicationId: string, status: string) {
    const application = await this.getApplicationOrThrow(applicationId);
    application.status = status as SubmissionStatus;
    await this.applicationRepository.save(application);
    return this.getApplicationView(applicationId);
  }

  async saveResumeCorrection(resumeId: string, correctedJson: string) {
    const resume = await this.getResumeOrThrow(resumeId);
    resume.correctedJson = correctedJson;
    await this.resumeRepository.save(resume);
    const application = await this.applicationRepository.findOne({
      where: { resumeId },
    });
    return application ? this.getApplicationView(application.id) : null;
  }

  async scoreApplicationManually(input: {
    applicationId: string;
    jdText: string;
    requiredSkills: string[];
    preferredSkills: string[];
    jobRequirementId?: string;
  }) {
    const application = await this.getApplicationOrThrow(input.applicationId);
    const resume = await this.getResumeOrThrow(application.resumeId);
    if (!resume.cleanedText) {
      throw new NotFoundException('简历或解析结果不存在');
    }
    const result = await this.bigModelService.scoreCandidateAgainstJd(
      resume.cleanedText,
      input.jdText,
      input.requiredSkills,
      input.preferredSkills,
    );
    const history = this.parseJsonArray<Record<string, unknown>>(
      application.scoreHistoryJson,
    );
    history.unshift({
      id: randomUUID(),
      overallScore: result.overallScore,
      skillScore: result.skillScore,
      experienceScore: result.experienceScore,
      educationScore: result.educationScore,
      aiComment: result.aiComment,
      scoredAt: new Date().toISOString(),
      jobRequirementId: input.jobRequirementId ?? null,
      jdText: input.jdText,
      requiredSkills: input.requiredSkills,
      preferredSkills: input.preferredSkills,
    });
    application.overallScore = result.overallScore;
    application.skillScore = result.skillScore;
    application.experienceScore = result.experienceScore;
    application.educationScore = result.educationScore;
    application.aiComment = result.aiComment;
    application.scoreHistoryJson = JSON.stringify(history);
    await this.applicationRepository.save(application);
    return this.getApplicationView(input.applicationId);
  }

  async listJobRankings(jobId: string) {
    const applications = await this.applicationRepository.find({
      where: { jobId },
    });
    const resumes = await this.resumeRepository.find();
    const resumeById = new Map(resumes.map((item) => [item.id, item]));
    return applications
      .filter((item) => item.overallScore !== null)
      .sort((a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0))
      .map((item) => ({
        applicationId: item.id,
        jobId: item.jobId,
        resumeId: item.resumeId,
        name: resumeById.get(item.resumeId)?.name ?? null,
        resumeSummary: resumeById.get(item.resumeId)?.resumeSummary ?? null,
        overallScore: item.overallScore,
        skillScore: item.skillScore,
        experienceScore: item.experienceScore,
        educationScore: item.educationScore,
        aiComment: item.aiComment,
      }));
  }

  private async getJobForApplication(applicationId: string) {
    const application = await this.getApplicationOrThrow(applicationId);
    return this.jobRepository.findOneByOrFail({ id: application.jobId });
  }

  private toJobView(item: JobEntity) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      requiredSkills: this.parseJsonArray(item.requiredSkillsJson),
      preferredSkills: this.parseJsonArray(item.preferredSkillsJson),
    };
  }

  private toApplicationView(
    application: JobApplicationEntity,
    resume: ResumeEntity | null,
  ): ApplicationView {
    return {
      id: application.id,
      jobId: application.jobId,
      resumeId: application.resumeId,
      name: resume?.name ?? null,
      email: resume?.email ?? null,
      phone: resume?.phone ?? null,
      city: resume?.city ?? null,
      status: application.status,
      resumeSummary: resume?.resumeSummary ?? null,
      resumeFilePath: resume?.storagePath ?? null,
      cleanedText: resume?.cleanedText ?? null,
      parseStatus: resume?.parseStatus ?? ParseStatus.PENDING,
      parseErrorMessage: resume?.parseErrorMessage ?? null,
      screeningStatus: application.screeningStatus,
      screeningStage: application.screeningStage,
      screeningErrorMessage: application.screeningErrorMessage,
      skills: this.parseJsonArray<string>(resume?.skillsJson ?? null),
      scores: this.parseJsonArray<Record<string, unknown>>(
        application.scoreHistoryJson,
      ),
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  private parseJsonArray<T>(value: string | null): T[] {
    if (!value) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobRequirementEntity, ResumeEntity } from './entities';
import { BigModelService } from '../../core/bigmodel/bigmodel.service';
import { SaveCandidateCorrectionDto } from './dto/save-candidate-correction.dto';
import { ScoreCandidateDto } from './dto/score-candidate.dto';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto';
import { UpsertJobRequirementDto } from './dto/upsert-job-requirement.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
    @InjectRepository(JobRequirementEntity)
    private readonly jobRequirementRepository: Repository<JobRequirementEntity>,
    private readonly bigModelService: BigModelService,
  ) {}

  async listCandidates() {
    const items = await this.resumeRepository.find({
      order: { createdAt: 'desc' },
    });
    return items.map((item) => this.toCandidateView(item));
  }

  async getCandidate(id: string) {
    const item = await this.resumeRepository.findOne({ where: { id } });
    if (!item) {
      return null;
    }
    return this.toCandidateView(item);
  }

  async updateStatus(input: UpdateCandidateStatusDto) {
    const item = await this.resumeRepository.findOne({
      where: { id: input.candidateId },
    });
    if (!item) {
      throw new NotFoundException('简历不存在');
    }
    item.status = input.status;
    await this.resumeRepository.save(item);
    return this.getCandidateOrThrow(input.candidateId);
  }

  async saveCorrection(input: SaveCandidateCorrectionDto) {
    const item = await this.resumeRepository.findOne({
      where: { id: input.candidateId },
    });
    if (!item) {
      throw new NotFoundException('简历不存在');
    }
    item.correctedJson = input.correctedJson;
    await this.resumeRepository.save(item);
    return this.getCandidateOrThrow(input.candidateId);
  }

  async upsertJobRequirement(input: UpsertJobRequirementDto) {
    const id = input.id ?? randomUUID();
    const entity = this.jobRequirementRepository.create({
      id,
      title: input.title,
      description: input.description,
      requiredSkillsJson: JSON.stringify(input.requiredSkills),
      preferredSkillsJson: JSON.stringify(input.preferredSkills),
    });
    await this.jobRequirementRepository.save(entity);
    return this.toJobRequirementView(entity);
  }

  async listJobRequirements() {
    const items = await this.jobRequirementRepository.find({
      order: { updatedAt: 'desc' },
    });
    return items.map((item) => this.toJobRequirementView(item));
  }

  async scoreCandidate(input: ScoreCandidateDto) {
    const resume = await this.resumeRepository.findOne({
      where: { id: input.candidateId },
    });
    if (!resume || !resume.cleanedText) {
      throw new NotFoundException('简历或解析结果不存在');
    }

    const result = await this.bigModelService.scoreCandidateAgainstJd(
      resume.cleanedText,
      input.jdText,
      input.requiredSkills,
      input.preferredSkills,
    );

    const history = this.parseJsonArray(resume.scoreHistoryJson);
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

    resume.jdText = input.jdText;
    resume.requiredSkillsJson = JSON.stringify(input.requiredSkills);
    resume.preferredSkillsJson = JSON.stringify(input.preferredSkills);
    resume.overallScore = result.overallScore;
    resume.skillScore = result.skillScore;
    resume.experienceScore = result.experienceScore;
    resume.educationScore = result.educationScore;
    resume.aiComment = result.aiComment;
    resume.scoreHistoryJson = JSON.stringify(history);
    await this.resumeRepository.save(resume);

    return this.getCandidateOrThrow(input.candidateId);
  }

  private async getCandidateOrThrow(id: string) {
    const candidate = await this.getCandidate(id);
    if (!candidate) {
      throw new NotFoundException('简历不存在');
    }
    return candidate;
  }

  private toCandidateView(item: ResumeEntity) {
    return {
      id: item.id,
      name: item.name,
      phone: item.phone,
      email: item.email,
      city: item.city,
      status: item.status,
      resumeSummary: item.resumeSummary,
      resumeFilePath: item.storagePath,
      cleanedText: item.cleanedText,
      parseStatus: item.parseStatus,
      parseErrorMessage: item.parseErrorMessage,
      screeningStatus: item.screeningStatus,
      screeningStage: item.screeningStage,
      screeningErrorMessage: item.screeningErrorMessage,
      skills: this.parseJsonArray(item.skillsJson),
      scores: this.parseJsonArray(item.scoreHistoryJson),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private toJobRequirementView(item: JobRequirementEntity) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      requiredSkills: this.parseJsonArray(item.requiredSkillsJson),
      preferredSkills: this.parseJsonArray(item.preferredSkillsJson),
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

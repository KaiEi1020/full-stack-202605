import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { BigModelService } from '../bigmodel/bigmodel.service';
import { ScoreCandidateInput } from './dto/score-candidate.input';
import { SaveCandidateCorrectionInput } from './dto/save-candidate-correction.input';
import { UpdateCandidateStatusInput } from './dto/update-candidate-status.input';
import { UpsertJobRequirementInput } from './dto/upsert-job-requirement.input';

@Injectable()
export class CandidateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bigModelService: BigModelService,
  ) {}

  async listCandidates() {
    const items = await this.prisma.candidate.findMany({
      include: { resumeFile: true, resumeParse: true, extraction: true, scores: { orderBy: { scoredAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      phone: item.phone,
      email: item.email,
      city: item.city,
      status: item.status,
      resumeSummary: item.resumeSummary,
      resumeFilePath: item.resumeFile?.storagePath ?? null,
      cleanedText: item.resumeParse?.cleanedText ?? null,
      skills: item.extraction ? JSON.parse(item.extraction.skillsJson) : [],
      scores: item.scores,
      createdAt: item.createdAt,
    }));
  }

  async getCandidate(id: string) {
    const item = await this.prisma.candidate.findUnique({
      where: { id },
      include: { resumeFile: true, resumeParse: true, extraction: true, scores: { orderBy: { scoredAt: 'desc' } } },
    });
    if (!item) {
      return null;
    }
    return {
      id: item.id,
      name: item.name,
      phone: item.phone,
      email: item.email,
      city: item.city,
      status: item.status,
      resumeSummary: item.resumeSummary,
      resumeFilePath: item.resumeFile?.storagePath ?? null,
      cleanedText: item.resumeParse?.cleanedText ?? null,
      skills: item.extraction ? JSON.parse(item.extraction.skillsJson) : [],
      scores: item.scores,
      createdAt: item.createdAt,
    };
  }

  async updateStatus(input: UpdateCandidateStatusInput) {
    await this.prisma.candidate.update({ where: { id: input.candidateId }, data: { status: input.status } });
    return this.getCandidateOrThrow(input.candidateId);
  }

  async saveCorrection(input: SaveCandidateCorrectionInput) {
    await this.prisma.candidateExtraction.update({
      where: { candidateId: input.candidateId },
      data: { correctedJson: input.correctedJson },
    });
    return this.getCandidateOrThrow(input.candidateId);
  }

  async upsertJobRequirement(input: UpsertJobRequirementInput) {
    return this.prisma.jobRequirement.upsert({
      where: { id: input.id ?? '__new__' },
      update: {
        title: input.title,
        description: input.description,
        requiredSkillsJson: JSON.stringify(input.requiredSkills),
        preferredSkillsJson: JSON.stringify(input.preferredSkills),
      },
      create: {
        id: randomUUID(),
        title: input.title,
        description: input.description,
        requiredSkillsJson: JSON.stringify(input.requiredSkills),
        preferredSkillsJson: JSON.stringify(input.preferredSkills),
      },
    }).then((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      requiredSkills: JSON.parse(item.requiredSkillsJson),
      preferredSkills: JSON.parse(item.preferredSkillsJson),
    }));
  }

  async listJobRequirements() {
    const items = await this.prisma.jobRequirement.findMany({ orderBy: { updatedAt: 'desc' } });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      requiredSkills: JSON.parse(item.requiredSkillsJson),
      preferredSkills: JSON.parse(item.preferredSkillsJson),
    }));
  }

  async scoreCandidate(input: ScoreCandidateInput) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: input.candidateId },
      include: { resumeParse: true },
    });
    if (!candidate || !candidate.resumeParse) {
      throw new NotFoundException('候选人或解析结果不存在');
    }
    const result = await this.bigModelService.scoreCandidateAgainstJd(
      candidate.resumeParse.cleanedText,
      input.jdText,
      input.requiredSkills,
      input.preferredSkills,
    );
    await this.prisma.candidateScore.create({
      data: {
        id: randomUUID(),
        candidateId: input.candidateId,
        jobRequirementId: input.jobRequirementId ?? null,
        jdText: input.jdText,
        requiredSkillsJson: JSON.stringify(input.requiredSkills),
        preferredSkillsJson: JSON.stringify(input.preferredSkills),
        overallScore: result.overallScore,
        skillScore: result.skillScore,
        experienceScore: result.experienceScore,
        educationScore: result.educationScore,
        aiComment: result.aiComment,
      },
    });
    return this.getCandidateOrThrow(input.candidateId);
  }

  private async getCandidateOrThrow(id: string) {
    const candidate = await this.getCandidate(id);
    if (!candidate) {
      throw new NotFoundException('候选人不存在');
    }
    return candidate;
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';

type ExtractionResult = {
  basicInfo: { name: string | null; phone: string | null; email: string | null; city: string | null };
  education: Array<Record<string, string>>;
  workExperience: Array<Record<string, string>>;
  skills: string[];
  projects: Array<Record<string, string>>;
  raw: string;
};

type ScoreResult = {
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  aiComment: string;
  raw: string;
};

@Injectable()
export class BigModelService {
  private readonly apiKey = process.env.BIGMODEL_API_KEY;
  private readonly endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  private readonly model = process.env.BIGMODEL_MODEL ?? 'glm-4.5-air';

  private ensureApiKey() {
    if (!this.apiKey) {
      throw new InternalServerErrorException('BIGMODEL_API_KEY 未配置');
    }
  }

  async extractCandidateProfile(text: string): Promise<ExtractionResult> {
    this.ensureApiKey();
    const payload = {
      model: this.model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: '你是简历解析助手。仅返回 JSON，字段包含 basicInfo, education, workExperience, skills, projects。',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    };
    const result = await this.requestJson(payload);
    return {
      basicInfo: {
        name: result.basicInfo?.name ?? null,
        phone: result.basicInfo?.phone ?? null,
        email: result.basicInfo?.email ?? null,
        city: result.basicInfo?.city ?? null,
      },
      education: Array.isArray(result.education) ? result.education : [],
      workExperience: Array.isArray(result.workExperience) ? result.workExperience : [],
      skills: Array.isArray(result.skills) ? result.skills : [],
      projects: Array.isArray(result.projects) ? result.projects : [],
      raw: JSON.stringify(result),
    };
  }

  async scoreCandidateAgainstJd(candidateText: string, jdText: string, requiredSkills: string[], preferredSkills: string[]): Promise<ScoreResult> {
    this.ensureApiKey();
    const payload = {
      model: this.model,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: '你是招聘匹配评分助手。仅返回 JSON，字段包含 overallScore, skillScore, experienceScore, educationScore, aiComment。所有分数范围 0-100。',
        },
        {
          role: 'user',
          content: JSON.stringify({ candidateText, jdText, requiredSkills, preferredSkills }),
        },
      ],
    };
    const result = await this.requestJson(payload);
    return {
      overallScore: Number(result.overallScore ?? 0),
      skillScore: Number(result.skillScore ?? 0),
      experienceScore: Number(result.experienceScore ?? 0),
      educationScore: Number(result.educationScore ?? 0),
      aiComment: String(result.aiComment ?? ''),
      raw: JSON.stringify(result),
    };
  }

  private async requestJson(payload: object) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new InternalServerErrorException(`BigModel 请求失败: ${response.status}`);
    }
    const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new InternalServerErrorException('BigModel 返回内容为空');
    }
    return JSON.parse(content) as Record<string, any>;
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResumeUploadService } from './resume-upload.service';

@Controller('api/resumes')
export class ResumeUploadController {
  constructor(private readonly resumeUploadService: ResumeUploadService) {}

  private parseStringArray(value?: string): string[] {
    if (!value) {
      return [];
    }
    try {
      const parsed: unknown = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      throw new BadRequestException('技能字段格式不正确');
    }
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  async upload(
    @UploadedFiles()
    files: Array<{
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    }>,
    @Body()
    body: {
      jdText?: string;
      requiredSkills?: string;
      preferredSkills?: string;
    },
  ): Promise<Array<{ resumeId: string; candidateId: string; jobId: string }>> {
    if (!files?.length) {
      throw new BadRequestException('请上传 PDF 文件');
    }
    if (files.length > 5) {
      throw new BadRequestException('单次最多上传 5 份简历');
    }
    if (files.some((file) => file.mimetype !== 'application/pdf')) {
      throw new BadRequestException('仅支持 PDF 格式');
    }
    const requiredSkills = this.parseStringArray(body.requiredSkills);
    const preferredSkills = this.parseStringArray(body.preferredSkills);
    return Promise.all(
      files.map((file) =>
        this.resumeUploadService.upload(
          file,
          body.jdText,
          requiredSkills,
          preferredSkills,
        ),
      ),
    );
  }
}

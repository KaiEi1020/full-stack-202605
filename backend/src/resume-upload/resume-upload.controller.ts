import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeUploadService } from './resume-upload.service';

@Controller('api/resumes')
export class ResumeUploadController {
  constructor(private readonly resumeUploadService: ResumeUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile()
    file: {
      originalname: string;
      mimetype: string;
      size: number;
      buffer: Buffer;
    },
  ): Promise<{ candidateId: string; jobId: string }> {
    if (!file) {
      throw new BadRequestException('请上传 PDF 文件');
    }
    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('仅支持 PDF 格式');
    }
    return this.resumeUploadService.upload(file);
  }
}

import { Module, forwardRef } from '@nestjs/common';
import { BigModelModule } from '../../../../core/bigmodel/bigmodel.module';
import { PdfModule } from '../../../../core/pdf/pdf.module';
import { SseModule } from '../../../../core/sse/sse.module';
import { RecruitmentModule } from '../../recruitment.module';
import { RecruitmentScreeningOrchestratorService } from '../../application/service/recruitment-screening-orchestrator.service';

@Module({
  imports: [
    PdfModule,
    BigModelModule,
    SseModule,
    forwardRef(() => RecruitmentModule),
  ],
  providers: [RecruitmentScreeningOrchestratorService],
  exports: [RecruitmentScreeningOrchestratorService],
})
export class RecruitmentScreeningModule {}

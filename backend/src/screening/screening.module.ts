import { Module } from '@nestjs/common';
import { BigModelModule } from '../bigmodel/bigmodel.module';
import { PdfModule } from '../pdf/pdf.module';
import { SseModule } from '../sse/sse.module';
import { ScreeningOrchestratorService } from './screening-orchestrator.service';

@Module({
  imports: [PdfModule, BigModelModule, SseModule],
  providers: [ScreeningOrchestratorService],
  exports: [ScreeningOrchestratorService],
})
export class ScreeningModule {}

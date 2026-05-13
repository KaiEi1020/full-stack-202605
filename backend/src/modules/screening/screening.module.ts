import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from '../candidate/entities';
import { BigModelModule } from '../../core/bigmodel/bigmodel.module';
import { PdfModule } from '../../core/pdf/pdf.module';
import { SseModule } from '../../core/sse/sse.module';
import { ScreeningOrchestratorService } from './screening-orchestrator.service';

@Module({
  imports: [
    PdfModule,
    BigModelModule,
    SseModule,
    TypeOrmModule.forFeature([ResumeEntity]),
  ],
  providers: [ScreeningOrchestratorService],
  exports: [ScreeningOrchestratorService],
})
export class ScreeningModule {}

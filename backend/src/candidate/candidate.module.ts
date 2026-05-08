import { Module } from '@nestjs/common';
import { BigModelModule } from '../bigmodel/bigmodel.module';
import { CandidateResolver } from './candidate.resolver';
import { CandidateService } from './candidate.service';

@Module({
  imports: [BigModelModule],
  providers: [CandidateResolver, CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}

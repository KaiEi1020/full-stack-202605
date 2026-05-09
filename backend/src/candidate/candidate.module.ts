import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequirementEntity, ResumeEntity } from '../database';
import { BigModelModule } from '../bigmodel/bigmodel.module';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';

@Module({
  imports: [BigModelModule, TypeOrmModule.forFeature([ResumeEntity, JobRequirementEntity])],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}

export { CandidateService };

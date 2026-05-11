import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequirementEntity } from './job-requirement.entity';
import { ResumeEntity } from './resume.entity';
import { UserEntity } from './user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ResumeEntity, JobRequirementEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

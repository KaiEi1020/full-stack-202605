import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { ScoreCandidateDto } from './dto/score-candidate.dto';
import { UpdateCandidateStatusDto } from './dto/update-candidate-status.dto';
import { UpsertJobRequirementDto } from './dto/upsert-job-requirement.dto';

@Controller('api')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('resumes')
  listResumes() {
    return this.candidateService.listCandidates();
  }

  @Get('resumes/:id')
  getResume(@Param('id') id: string) {
    return this.candidateService.getCandidate(id);
  }

  @Patch('resumes/:id/status')
  updateResumeStatus(
    @Param('id') id: string,
    @Body() body: { status: UpdateCandidateStatusDto['status'] },
  ) {
    return this.candidateService.updateStatus({
      candidateId: id,
      status: body.status,
    });
  }

  @Patch('resumes/:id/correction')
  saveResumeCorrection(
    @Param('id') id: string,
    @Body() body: { correctedJson: string },
  ) {
    return this.candidateService.saveCorrection({
      candidateId: id,
      correctedJson: body.correctedJson,
    });
  }

  @Post('resumes/:id/score')
  scoreResume(
    @Param('id') id: string,
    @Body() body: Omit<ScoreCandidateDto, 'candidateId'>,
  ) {
    return this.candidateService.scoreCandidate({ candidateId: id, ...body });
  }

  @Get('job-requirements')
  listJobRequirements() {
    return this.candidateService.listJobRequirements();
  }

  @Post('job-requirements')
  upsertJobRequirement(@Body() input: UpsertJobRequirementDto) {
    return this.candidateService.upsertJobRequirement(input);
  }
}

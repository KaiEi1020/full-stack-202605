import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { SaveCandidateCorrectionInput } from './dto/save-candidate-correction.input';
import { ScoreCandidateInput } from './dto/score-candidate.input';
import { UpdateCandidateStatusInput } from './dto/update-candidate-status.input';
import { UpsertJobRequirementInput } from './dto/upsert-job-requirement.input';

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
  updateResumeStatus(@Param('id') id: string, @Body() body: { status: UpdateCandidateStatusInput['status'] }) {
    return this.candidateService.updateStatus({ candidateId: id, status: body.status });
  }

  @Patch('resumes/:id/correction')
  saveResumeCorrection(@Param('id') id: string, @Body() body: { correctedJson: string }) {
    return this.candidateService.saveCorrection({ candidateId: id, correctedJson: body.correctedJson });
  }

  @Post('resumes/:id/score')
  scoreResume(
    @Param('id') id: string,
    @Body() body: Omit<ScoreCandidateInput, 'candidateId'>,
  ) {
    return this.candidateService.scoreCandidate({ candidateId: id, ...body });
  }

  @Get('job-requirements')
  listJobRequirements() {
    return this.candidateService.listJobRequirements();
  }

  @Post('job-requirements')
  upsertJobRequirement(@Body() input: UpsertJobRequirementInput) {
    return this.candidateService.upsertJobRequirement(input);
  }
}

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CandidateService } from './candidate.service';
import { SaveCandidateCorrectionInput } from './dto/save-candidate-correction.input';
import { ScoreCandidateInput } from './dto/score-candidate.input';
import { UpdateCandidateStatusInput } from './dto/update-candidate-status.input';
import { UpsertJobRequirementInput } from './dto/upsert-job-requirement.input';
import { CandidateModel } from './models/candidate.model';
import { JobRequirementModel } from './models/job-requirement.model';

@Resolver(() => CandidateModel)
export class CandidateResolver {
  constructor(private readonly candidateService: CandidateService) {}

  @Query(() => [CandidateModel])
  candidates() {
    return this.candidateService.listCandidates();
  }

  @Query(() => CandidateModel, { nullable: true })
  candidate(@Args('id') id: string) {
    return this.candidateService.getCandidate(id);
  }

  @Query(() => [JobRequirementModel])
  jobRequirements() {
    return this.candidateService.listJobRequirements();
  }

  @Mutation(() => CandidateModel)
  updateCandidateStatus(@Args('input') input: UpdateCandidateStatusInput) {
    return this.candidateService.updateStatus(input);
  }

  @Mutation(() => CandidateModel)
  saveCandidateCorrection(@Args('input') input: SaveCandidateCorrectionInput) {
    return this.candidateService.saveCorrection(input);
  }

  @Mutation(() => CandidateModel)
  scoreCandidate(@Args('input') input: ScoreCandidateInput) {
    return this.candidateService.scoreCandidate(input);
  }

  @Mutation(() => JobRequirementModel)
  upsertJobRequirement(@Args('input') input: UpsertJobRequirementInput) {
    return this.candidateService.upsertJobRequirement(input);
  }
}

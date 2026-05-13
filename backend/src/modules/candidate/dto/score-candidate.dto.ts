export class ScoreCandidateDto {
  candidateId!: string;
  jobRequirementId?: string;
  jdText!: string;
  requiredSkills!: string[];
  preferredSkills!: string[];
}

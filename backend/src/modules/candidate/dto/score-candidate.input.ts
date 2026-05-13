export class ScoreCandidateInput {
  candidateId!: string;
  jobRequirementId?: string;
  jdText!: string;
  requiredSkills!: string[];
  preferredSkills!: string[];
}

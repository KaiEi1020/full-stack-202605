export class UpsertJobRequirementInput {
  id?: string;
  title!: string;
  description!: string;
  requiredSkills!: string[];
  preferredSkills!: string[];
}

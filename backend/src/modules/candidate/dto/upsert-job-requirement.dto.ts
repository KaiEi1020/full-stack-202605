export class UpsertJobRequirementDto {
  id?: string;
  title!: string;
  description!: string;
  requiredSkills!: string[];
  preferredSkills!: string[];
}

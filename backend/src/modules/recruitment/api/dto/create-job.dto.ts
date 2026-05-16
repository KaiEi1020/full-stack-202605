export class CreateJobDto {
  id?: string;
  title!: string;
  description!: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
}

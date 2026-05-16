import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { ParseStatus } from '../../../domain/vo/parse-status.enum';

@Entity({ tableName: 'resumes' })
export class ResumeEntity {
  @PrimaryKey({ type: 'uuid' })
  id!: string;

  @Property({ nullable: true })
  name!: string | null;

  @Property({ nullable: true })
  phone!: string | null;

  @Property({ nullable: true })
  email!: string | null;

  @Property({ nullable: true })
  city!: string | null;

  @Property({ nullable: true })
  resumeSummary!: string | null;

  @Property({ nullable: true })
  highlightedStrengths!: string | null;

  @Property({ nullable: true })
  highlightedWeaknesses!: string | null;

  @Property({ nullable: true })
  originalName!: string | null;

  @Property({ nullable: true })
  storagePath!: string | null;

  @Property({ nullable: true })
  mimeType!: string | null;

  @Property({ type: 'integer', nullable: true })
  sizeBytes!: number | null;

  @Property({ type: 'integer', nullable: true })
  pageCount!: number | null;

  @Property({ nullable: true })
  rawText!: string | null;

  @Property({ nullable: true })
  cleanedText!: string | null;

  @Property({ default: ParseStatus.PENDING })
  parseStatus!: ParseStatus;

  @Property({ nullable: true })
  parseErrorMessage!: string | null;

  @Property({ type: 'timestamptz', nullable: true })
  parsedAt!: Date | null;

  @Property({ nullable: true })
  basicInfoJson!: string | null;

  @Property({ nullable: true })
  educationJson!: string | null;

  @Property({ nullable: true })
  workExperienceJson!: string | null;

  @Property({ nullable: true })
  skillsJson!: string | null;

  @Property({ nullable: true })
  projectJson!: string | null;

  @Property({ nullable: true })
  rawModelOutput!: string | null;

  @Property({ nullable: true })
  correctedJson!: string | null;

  @Property({ type: 'timestamptz', nullable: true })
  extractedAt!: Date | null;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;
}

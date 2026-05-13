import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CandidateStatus } from './candidate-status.enum';
import { JobStatus } from './job-status.enum';
import { ParseStatus } from './parse-status.enum';

@Entity('resumes')
export class ResumeEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text', { nullable: true })
  name!: string | null;

  @Column('text', { nullable: true })
  phone!: string | null;

  @Column('text', { nullable: true })
  email!: string | null;

  @Column('text', { nullable: true })
  city!: string | null;

  @Column('text', { default: CandidateStatus.PENDING })
  status!: CandidateStatus;

  @Column('text', { nullable: true })
  resumeSummary!: string | null;

  @Column('text', { nullable: true })
  highlightedStrengths!: string | null;

  @Column('text', { nullable: true })
  highlightedWeaknesses!: string | null;

  @Column('text', { nullable: true })
  originalName!: string | null;

  @Column('text', { nullable: true })
  storagePath!: string | null;

  @Column('text', { nullable: true })
  mimeType!: string | null;

  @Column('integer', { nullable: true })
  sizeBytes!: number | null;

  @Column('integer', { nullable: true })
  pageCount!: number | null;

  @Column('text', { nullable: true })
  rawText!: string | null;

  @Column('text', { nullable: true })
  cleanedText!: string | null;

  @Column('text', { default: ParseStatus.PENDING })
  parseStatus!: ParseStatus;

  @Column('text', { nullable: true })
  parseErrorMessage!: string | null;

  @Column('datetime', { nullable: true })
  parsedAt!: Date | null;

  @Column('text', { nullable: true })
  basicInfoJson!: string | null;

  @Column('text', { nullable: true })
  educationJson!: string | null;

  @Column('text', { nullable: true })
  workExperienceJson!: string | null;

  @Column('text', { nullable: true })
  skillsJson!: string | null;

  @Column('text', { nullable: true })
  projectJson!: string | null;

  @Column('text', { nullable: true })
  rawModelOutput!: string | null;

  @Column('text', { nullable: true })
  correctedJson!: string | null;

  @Column('datetime', { nullable: true })
  extractedAt!: Date | null;

  @Column('text', { nullable: true })
  jdText!: string | null;

  @Column('text', { nullable: true })
  requiredSkillsJson!: string | null;

  @Column('text', { nullable: true })
  preferredSkillsJson!: string | null;

  @Column('text', { default: JobStatus.PENDING })
  screeningStatus!: JobStatus;

  @Column('text', { nullable: true })
  screeningStage!: string | null;

  @Column('text', { nullable: true })
  screeningErrorMessage!: string | null;

  @Column('datetime', { nullable: true })
  screeningStartedAt!: Date | null;

  @Column('datetime', { nullable: true })
  screeningFinishedAt!: Date | null;

  @Column('integer', { nullable: true })
  overallScore!: number | null;

  @Column('integer', { nullable: true })
  skillScore!: number | null;

  @Column('integer', { nullable: true })
  experienceScore!: number | null;

  @Column('integer', { nullable: true })
  educationScore!: number | null;

  @Column('text', { nullable: true })
  aiComment!: string | null;

  @Column('text', { nullable: true })
  comparedLabel!: string | null;

  @Column('text', { nullable: true })
  scoreHistoryJson!: string | null;

  @Column('text', { nullable: true })
  eventHistoryJson!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

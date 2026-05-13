import {
  CandidateStatus,
  JobStatus,
  ParseStatus,
  ResumeEntity,
} from '../candidate/entities';
import { CandidateService } from './candidate.service';

describe('CandidateService', () => {
  const resumeRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const jobRequirementRepository = {
    find: jest.fn(),
  };

  const bigModelService = {};

  let service: CandidateService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new CandidateService(
      resumeRepository as never,
      jobRequirementRepository as never,
      bigModelService as never,
    );
  });

  it('returns parse status and failure reason in list responses', async () => {
    const createdAt = new Date('2026-05-09T10:00:00.000Z');
    const updatedAt = new Date('2026-05-09T10:05:00.000Z');
    const resume = {
      id: 'resume-1',
      name: null,
      phone: null,
      email: null,
      city: null,
      status: CandidateStatus.REJECTED,
      resumeSummary: null,
      storagePath: '/tmp/resume.pdf',
      cleanedText: null,
      parseStatus: ParseStatus.FAILED,
      parseErrorMessage: 'PDF 内容为空',
      screeningStatus: JobStatus.FAILED,
      screeningStage: 'failed',
      screeningErrorMessage: 'PDF 内容为空',
      skillsJson: JSON.stringify([]),
      scoreHistoryJson: JSON.stringify([]),
      createdAt,
      updatedAt,
    } as ResumeEntity;

    resumeRepository.find.mockResolvedValue([resume]);

    await expect(service.listCandidates()).resolves.toEqual([
      expect.objectContaining({
        id: 'resume-1',
        parseStatus: ParseStatus.FAILED,
        parseErrorMessage: 'PDF 内容为空',
        screeningStatus: JobStatus.FAILED,
        screeningStage: 'failed',
        screeningErrorMessage: 'PDF 内容为空',
        createdAt,
        updatedAt,
      }),
    ]);
  });
});

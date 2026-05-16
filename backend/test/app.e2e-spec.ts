import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';
import request, { type Response } from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { BigModelService } from './../src/core/bigmodel/bigmodel.service';
import { ResumeEntity } from './../src/modules/recruitment/infrastructure/persistence/entities/resume.entity';
import { JobEntity } from './../src/modules/recruitment/infrastructure/persistence/entities/job.entity';
import { JobApplicationEntity } from './../src/modules/recruitment/infrastructure/persistence/entities/job-application.entity';
import { PdfParserService } from './../src/core/pdf/pdf-parser.service';
import { UserEntity } from './../src/modules/user/infrastructure/persistence/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let em: EntityManager;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PdfParserService)
      .useValue({
        parse: jest.fn().mockResolvedValue({
          pageCount: 1,
          rawText: 'raw resume text',
          cleanedText: 'cleaned resume text',
        }),
      })
      .overrideProvider(BigModelService)
      .useValue({
        extractCandidateProfile: jest.fn().mockResolvedValue({
          basicInfo: {
            name: 'Ada Lovelace',
            phone: '13800000001',
            email: 'ada@example.com',
            city: 'London',
          },
          education: [],
          workExperience: [],
          skills: ['TypeScript'],
          projects: [],
          raw: '{}',
        }),
        scoreCandidateAgainstJd: jest.fn().mockResolvedValue({
          overallScore: 92,
          skillScore: 91,
          experienceScore: 90,
          educationScore: 89,
          aiComment: 'strong candidate',
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({ origin: true });
    await app.init();

    em = app.get(EntityManager);

    // Clean up tables in correct order (applications first due to potential FK)
    await em.nativeDelete(JobApplicationEntity, {});
    await em.nativeDelete(ResumeEntity, {});
    await em.nativeDelete(JobEntity, {});
    await em.nativeDelete(UserEntity, {});

    // Seed users
    em.create(UserEntity, {
      id: '1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '13800000001',
    });
    em.create(UserEntity, {
      id: '2',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      phone: '13800000002',
    });
    em.create(UserEntity, {
      id: '3',
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      phone: '13800000003',
    });
    await em.flush();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /api/users returns users through the service path', async () => {
    const response: Response = await request(app.getHttpServer())
      .get('/api/users')
      .expect(200);
    expect(response.body).toHaveLength(3);
  });

  it('POST /api/users registers a user', async () => {
    const response: Response = await request(app.getHttpServer())
      .post('/api/users')
      .send({ name: 'New User', phone: '13800000009' })
      .expect(201);

    expect((response.body as { phone: string }).phone).toBe('13800000009');
  });

  it('rejects non-pdf uploads', async () => {
    await request(app.getHttpServer())
      .post('/api/recruitment/jobs')
      .send({
        title: '前端工程师',
        description: 'React',
        requiredSkills: [],
        preferredSkills: [],
      })
      .expect(201);

    const response: Response = await request(app.getHttpServer())
      .post('/api/recruitment/jobs/default-job/submissions/upload')
      .attach('files', Buffer.from('not-pdf'), {
        filename: 'resume.txt',
        contentType: 'text/plain',
      })
      .expect(400);

    expect((response.body as { message: string }).message).toBe(
      '仅支持 PDF 格式',
    );
  });

  it('creates a resume and application after pdf upload', async () => {
    await request(app.getHttpServer())
      .post('/api/recruitment/jobs')
      .send({
        title: '前端工程师',
        description: 'React',
        requiredSkills: [],
        preferredSkills: [],
        id: 'default-job',
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/recruitment/jobs/default-job/submissions/upload')
      .attach('files', Buffer.from('%PDF-1.4 mock'), {
        filename: 'resume.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    const resumes = await em.find(ResumeEntity, {});
    const applications = await em.find(JobApplicationEntity, {});
    expect(resumes.length).toBe(1);
    expect(applications.length).toBe(1);
  });

  it('updates application status after screening completes', async () => {
    await request(app.getHttpServer())
      .post('/api/recruitment/jobs')
      .send({
        title: '前端工程师',
        description: 'React',
        requiredSkills: [],
        preferredSkills: [],
        id: 'default-job',
      })
      .expect(201);

    const response: Response = await request(app.getHttpServer())
      .post('/api/recruitment/jobs/default-job/submissions/upload')
      .attach('files', Buffer.from('%PDF-1.4 mock'), {
        filename: 'resume.pdf',
        contentType: 'application/pdf',
      })
      .expect(201);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const body = response.body as Array<{ applicationId: string }>;
    const application = await em.findOneOrFail(JobApplicationEntity, {
      id: body[0].applicationId,
    });
    expect(application.status).toBe('PASSED');
  });

  afterEach(async () => {
    await app.close();
  });
});

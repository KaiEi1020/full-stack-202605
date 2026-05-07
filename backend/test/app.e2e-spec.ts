import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({ origin: true });
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany();
    await prisma.user.createMany({
      data: [
        { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
        { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
        { id: '3', name: 'Linus Torvalds', email: 'linus@example.com' },
      ],
    });
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/graphql (POST) returns users through the service path', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ users { id name email } }',
      })
      .expect(200);

    expect(response.body.data.users).toEqual([
      { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
      { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
      { id: '3', name: 'Linus Torvalds', email: 'linus@example.com' },
    ]);
  });

  it('/graphql (POST) returns users through the ddd path', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'query { users(mode: "ddd") { id name email } }',
      })
      .expect(200);

    expect(response.body.data.users).toEqual([
      { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
      { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
      { id: '3', name: 'Linus Torvalds', email: 'linus@example.com' },
    ]);
  });

  it('/graphql (POST) returns a single user by id', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'query ($id: String!) { user(id: $id) { id name email } }',
        variables: { id: '2' },
      })
      .expect(200);

    expect(response.body.data.user).toEqual({
      id: '2',
      name: 'Grace Hopper',
      email: 'grace@example.com',
    });
  });

  it('/graphql (POST) returns null for unknown user id', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'query ($id: String!) { user(id: $id) { id name email } }',
        variables: { id: '999' },
      })
      .expect(200);

    expect(response.body.data.user).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});

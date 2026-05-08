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
        { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', phone: '13800000001' },
        { id: '2', name: 'Grace Hopper', email: 'grace@example.com', phone: '13800000002' },
        { id: '3', name: 'Linus Torvalds', email: 'linus@example.com', phone: '13800000003' },
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
        query: '{ users { id name email phone } }',
      })
      .expect(200);

    expect(response.body.data.users).toEqual([
      { id: '1', name: 'Ada Lovelace', email: 'ada@example.com', phone: '13800000001' },
      { id: '2', name: 'Grace Hopper', email: 'grace@example.com', phone: '13800000002' },
      { id: '3', name: 'Linus Torvalds', email: 'linus@example.com', phone: '13800000003' },
    ]);
  });

  it('/graphql (POST) returns a single user by id', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'query ($id: String!) { user(id: $id) { id name email phone } }',
        variables: { id: '2' },
      })
      .expect(200);

    expect(response.body.data.user).toEqual({
      id: '2',
      name: 'Grace Hopper',
      email: 'grace@example.com',
      phone: '13800000002',
    });
  });

  it('/graphql (POST) returns null for unknown user id', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'query ($id: String!) { user(id: $id) { id name email phone } }',
        variables: { id: '999' },
      })
      .expect(200);

    expect(response.body.data.user).toBeNull();
  });

  it('/graphql (POST) registers a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation ($input: RegisterUserInput!) { registerUser(input: $input) { id name email phone } }',
        variables: { input: { name: 'New User', phone: '13800000009' } },
      })
      .expect(200);

    expect(response.body.data.registerUser.name).toBe('New User');
    expect(response.body.data.registerUser.phone).toBe('13800000009');
    expect(response.body.data.registerUser.email).toBe('13800000009@example.com');
  });

  it('/graphql (POST) rejects duplicate phone registration', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: 'mutation ($input: RegisterUserInput!) { registerUser(input: $input) { id name email phone } }',
        variables: { input: { name: 'Duplicate User', phone: '13800000002' } },
      })
      .expect(200);

    expect(response.body.errors[0].message).toBe('手机号已存在');
  });

  afterEach(async () => {
    await app.close();
  });
});

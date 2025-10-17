import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { getModelToken } from '@nestjs/mongoose';
import { ActivitiesResolver } from './activities.resolver';
import { ActivitiesService } from './activities.service';
import { Activity } from './schemas/activity.schema';
import { PubSub } from 'graphql-subscriptions';
import request from 'supertest';

describe('Activities Subscription Integration', () => {
  let app: INestApplication;

  const mockActivity = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Integration Test',
    message: 'Testing the full flow with subscriptions',
    category: 'Feature',
    createdAt: new Date(),
    expiresAt: '2026-03-15T10:30:00.000Z',
    isActive: true,
  };

  const mockSave = jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  });

  const mockActivityModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    ...mockActivity,
    save: mockSave,
  })) as any;

  mockActivityModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([mockActivity]),
  });

  mockActivityModel.findById = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockActivity),
  });

  mockActivityModel.findOne = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockActivity),
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
          subscriptions: {
            'graphql-ws': true,
          },
        }),
      ],
      providers: [
        ActivitiesResolver,
        ActivitiesService,
        {
          provide: getModelToken(Activity.name),
          useValue: mockActivityModel,
        },
        {
          provide: 'PUB_SUB',
          useValue: new PubSub(),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GraphQL endpoints', () => {
    it('should create activity via mutation', async () => {
      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: `
            mutation {
              createActivity(createActivityInput: {
                title: "Integration Test"
                message: "Testing the full flow with subscriptions"
                category: "Feature"
                expiresAt: "2026-03-15T10:30:00.000Z"
              }) {
                _id
                title
                message
                category
                isActive
              }
            }
          `,
        });

      console.log('Response:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(200);
      if (response.body.errors) {
        console.error('GraphQL Errors:', response.body.errors);
      }
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.createActivity).toBeDefined();
      expect(response.body.data.createActivity.title).toBe('Integration Test');
    });
  });
});

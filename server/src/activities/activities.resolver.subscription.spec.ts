import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesResolver } from './activities.resolver';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { PubSub } from 'graphql-subscriptions';

const mockPubSub = {
  publish: jest.fn().mockResolvedValue(Promise.resolve()),
  asyncIterator: jest.fn().mockReturnValue({
    [Symbol.asyncIterator]: jest.fn(),
  }),
};

jest.mock('graphql-subscriptions', () => ({
  PubSub: jest.fn(() => mockPubSub),
}));

describe('ActivitiesResolver - Subscriptions', () => {
  let resolver: ActivitiesResolver;
  let service: ActivitiesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesResolver,
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'PUB_SUB', 
          useValue: mockPubSub,
        },
      ],
    }).compile();

    resolver = module.get<ActivitiesResolver>(ActivitiesResolver);
    service = module.get<ActivitiesService>(ActivitiesService);
  });

  describe('createActivity with subscription', () => {
    it('should publish activity to subscription when created', async () => {
      const createActivityInput: CreateActivityInput = {
        title: 'Subscription Test',
        message: 'Testing subscription functionality',
        category: 'Update',
        expiresAt: '2026-03-15T10:30:00.000Z',
      };

      const mockActivity = {
        _id: '123',
        ...createActivityInput,
        createdAt: new Date(),
        expiresAt: new Date(createActivityInput.expiresAt),
        isActive: true,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockActivity as any);

      const result = await resolver.createActivity(createActivityInput);

      expect(service.create).toHaveBeenCalledWith(createActivityInput);
      expect(result).toEqual(mockActivity);

    });
  });

  describe('activityCreated subscription', () => {
    it('should return an async iterator for activityCreated', () => {
      const result = resolver.activityCreated();

      expect(mockPubSub.asyncIterator).toHaveBeenCalledWith('activityCreated');
      expect(result).toBeDefined();
    });
  });
});

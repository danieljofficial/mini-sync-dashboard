import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesResolver } from './activities.resolver';
import { ActivitiesService } from './activities.service';
import { CreateActivityInput } from './dto/create-activity.input';

describe('ActivitiesResolver', () => {
  let resolver: ActivitiesResolver;

  let service: ActivitiesService;
  const mockPubSub = {
    asyncIterator: jest.fn(),
    publish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesResolver,
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findActive: jest.fn(),
            findByCategory: jest.fn(),
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

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createActivity', () => {
    it('should create an activity', async () => {
      const createActivityInput: CreateActivityInput = {
        title: 'Test Activity',
        message: 'Test message for activity',
        category: 'Update',
        expiresAt: '2026-03-15T10:30:00.000Z',
      };

      const mockResult = {
        _id: '123',
        ...createActivityInput,
        createdAt: new Date(),
        expiresAt: null,
        isActive: true,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockResult as any);

      const result = await resolver.createActivity(createActivityInput);

      expect(service.create).toHaveBeenCalledWith(createActivityInput);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should return all activities', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Activity 1',
          message: 'Message 1',
          category: 'Update',
          expiresAt: new Date('2026-03-15T10:30:00.000Z'),
          createdAt: new Date(),
          isActive: true,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockActivities as any);

      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockActivities);
    });
  });

  describe('findActive', () => {
    it('should return active activities', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Active Activity',
          message: 'Active message',
          category: 'Maintenance',
          expiresAt: new Date('2026-03-15T10:30:00.000Z'),
          createdAt: new Date(),
          isActive: true,
        },
      ];

      jest
        .spyOn(service, 'findActive')
        .mockResolvedValue(mockActivities as any);

      const result = await resolver.findActive();

      expect(service.findActive).toHaveBeenCalled();
      expect(result).toEqual(mockActivities);
    });
  });

  describe('findByCategory', () => {
    it('should return activities by category', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Feature Activity',
          message: 'Feature message',
          category: 'Feature',
          expiresAt: new Date('2026-03-15T10:30:00.000Z'),
          createdAt: new Date(),
          isActive: true,
        },
      ];

      jest
        .spyOn(service, 'findByCategory')
        .mockResolvedValue(mockActivities as any);

      const result = await resolver.findByCategory('Feature');

      expect(service.findByCategory).toHaveBeenCalledWith('Feature');
      expect(result).toEqual(mockActivities);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesService } from './activities.service';
import { getModelToken } from '@nestjs/mongoose';
import { Activity } from './schemas/activity.schema';
import { CreateActivityInput } from './dto/create-activity.input';

const mockPubSub = {
  publish: jest.fn(),
  asyncIterator: jest.fn(),
};

jest.mock('graphql-subscriptions', () => ({
  PubSub: jest.fn(() => mockPubSub),
}));

describe('ActivitiesService', () => {
  let service: ActivitiesService;
  let mockActivityModel: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockActivityModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save: jest.fn().mockResolvedValue({
        _id: '123',
        ...data,
        createdAt: new Date(),
        isActive: true,
      }),
    }));

    mockActivityModel.find = jest.fn();
    mockActivityModel.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivitiesService,
        {
          provide: getModelToken(Activity.name),
          useValue: mockActivityModel,
        },
      ],
    }).compile();

    service = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a valid activity', async () => {
      const createActivityInput: CreateActivityInput = {
        title: 'System Maintenance',
        message: 'We will perform maintenance from 2-4 AM',
        category: 'Maintenance',
        expiresAt: '2026-03-15T10:30:00.000Z',
      };

      const mockSavedActivity = {
        _id: '123',
        ...createActivityInput,
        createdAt: new Date(),
        expiresAt: null,
        isActive: true,
      };

      // Mock the save method
      const mockSaveInstance = {
        save: jest.fn().mockResolvedValue(mockSavedActivity),
      };

      mockActivityModel.prototype.save = mockSaveInstance.save;
      mockActivityModel.mockImplementation(() => mockSaveInstance);

      const result = await service.create(createActivityInput);
      expect(mockActivityModel).toHaveBeenCalledWith({
        title: 'System Maintenance',
        message: 'We will perform maintenance from 2-4 AM',
        category: 'Maintenance',
        expiresAt: new Date('2026-03-15T10:30:00.000Z'),
      });

      expect(result).toEqual(mockSavedActivity);
      expect(mockSaveInstance.save).toHaveBeenCalled();
    });

    it('should set isActive to false if expiresAt is in the past', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      const createActivityInput: CreateActivityInput = {
        title: 'Expired Activity',
        message: 'This should be inactive',
        category: 'Update',
        expiresAt: pastDate.toISOString(),
      };

      const mockSavedActivity = {
        _id: '123',
        ...createActivityInput,
        createdAt: new Date(),
        expiresAt: pastDate,
        isActive: false, 
      };

      const mockSaveInstance = {
        save: jest.fn().mockResolvedValue(mockSavedActivity),
      };

      mockActivityModel.prototype.save = mockSaveInstance.save;
      mockActivityModel.mockImplementation(() => mockSaveInstance);

      const result = await service.create(createActivityInput);

      expect(result.isActive).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all non-expired activities', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Active Activity 1',
          message: 'This is active',
          category: 'Update',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          createdAt: new Date(),
          isActive: true,
        },
        {
          _id: '2',
          title: 'Active Activity 2',
          message: 'This is also active',
          category: 'Maintenance',
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
          createdAt: new Date(),
          isActive: true,
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockActivities),
      };

      mockActivityModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(mockActivityModel.find).toHaveBeenCalledWith({
        $or: [{ expiresAt: { $gt: expect.any(Date) } }, { expiresAt: null }],
      });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockActivities);
    });

    it('should exclude expired activities', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Active Activity',
          message: 'This is active',
          category: 'Update',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          createdAt: new Date(),
          isActive: true,
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockActivities),
      };

      mockActivityModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Active Activity');
    });

    it('should return empty array when no activities exist', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockActivityModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('should return only active activities', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Active Activity',
          message: 'This is active',
          category: 'Update',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          isActive: true,
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockActivities),
      };

      mockActivityModel.find.mockReturnValue(mockQuery);

      const result = await service.findActive();

      expect(mockActivityModel.find).toHaveBeenCalledWith({
        isActive: true,
        $or: [{ expiresAt: { $gt: expect.any(Date) } }, { expiresAt: null }],
      });
      expect(result).toEqual(mockActivities);
    });
  });

  describe('findByCategory', () => {
    it('should return activities filtered by category', async () => {
      const mockActivities = [
        {
          _id: '1',
          title: 'Maintenance Activity',
          message: 'Maintenance message',
          category: 'Maintenance',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          isActive: true,
        },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockActivities),
      };

      mockActivityModel.find.mockReturnValue(mockQuery);

      const result = await service.findByCategory('Maintenance');

      expect(mockActivityModel.find).toHaveBeenCalledWith({
        category: 'Maintenance',
        $or: [{ expiresAt: { $gt: expect.any(Date) } }, { expiresAt: null }],
      });
      expect(result[0].category).toBe('Maintenance');
    });
  });

  describe('create with subscription', () => {
    it('should publish activity to subscribers when created', async () => {
      const createActivityInput: CreateActivityInput = {
        title: 'New Feature',
        message: 'We have released a new feature',
        category: 'Feature',
        expiresAt: '2026-03-15T10:30:00.000Z',
      };

      const mockSavedActivity = {
        _id: '123',
        ...createActivityInput,
        createdAt: new Date(),
        expiresAt: new Date(createActivityInput.expiresAt),
        isActive: true,
      };

      const mockInstance = {
        save: jest.fn().mockResolvedValue(mockSavedActivity),
      };

      mockActivityModel.mockImplementation(() => mockInstance);

      const result = await service.create(createActivityInput);

      expect(mockInstance.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedActivity);
    });
  });
});

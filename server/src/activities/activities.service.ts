import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityInput } from './dto/create-activity.input';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}
  async create(createActivityInput: CreateActivityInput): Promise<Activity> {

    const activityData = {
      title: createActivityInput.title,
      message: createActivityInput.message,
      category: createActivityInput.category,
      expiresAt: new Date(createActivityInput.expiresAt),
    };

    const createdActivity = new this.activityModel(activityData);
    return createdActivity.save();
  }
  async findAll(): Promise<Activity[]> {
    const now = new Date();
    return this.activityModel
      .find({
        $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
      })
      .sort({ createdAt: -1 })
      .exec();
  }
  async findActive(): Promise<Activity[]> {
    const now = new Date();
    return this.activityModel
      .find({
        isActive: true,
        $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByCategory(category: string): Promise<Activity[]> {
    const now = new Date();

    return this.activityModel
      .find({
        category,
        $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }],
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<ActivityDocument> {
    const activity = await this.activityModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }
}

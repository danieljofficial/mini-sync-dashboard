import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Activity)
export class ActivitiesResolver {
  constructor(
    private readonly activitiesService: ActivitiesService,
    @Inject('PUB_SUB') private pubSub: PubSub, 
  ) {}

  @Mutation(() => Activity)
  async createActivity(
    @Args('createActivityInput') createActivityInput: CreateActivityInput,
  ): Promise<Activity> {
    const activity = await this.activitiesService.create(createActivityInput);

    if (!activity) {
      throw new BadRequestException('Failed to create activity');
    }

    await this.pubSub.publish('activityCreated', {
      activityCreated: activity,
    });

    return activity;
  }

  @Query(() => [Activity], { name: 'getActivities' })
  async findAll(): Promise<Activity[]> {
    const activities = await this.activitiesService.findAll();

    if (!activities || activities.length === 0) {
      return []; 
    }

    return activities;
  }

  @Query(() => [Activity], { name: 'getActiveActivities' })
  async findActive(): Promise<Activity[]> {
    return this.activitiesService.findActive();
  }

  @Query(() => [Activity], { name: 'getActivitiesByCategory' })
  findByCategory(@Args('category') category: string): Promise<Activity[]> {
    return this.activitiesService.findByCategory(category);
  }

  @Subscription(() => Activity, {
    name: 'activityCreated',
  })
  activityCreated() {
    return this.pubSub.asyncIterator('activityCreated');
  }
}

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Activity {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  category: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  expiresAt?: Date;

  @Field()
  isActive: boolean;
}

import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateActivityInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  message: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEnum(['Maintenance', 'Feature', 'Update'], {
    message: 'Category must be Maintenance, Feature, or Update',
  })
  category: string;

  @Field()
  // @IsOptional()
  @IsDateString()
  expiresAt: string;
}

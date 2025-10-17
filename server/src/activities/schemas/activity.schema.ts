import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  _id: string;

  @Prop({ required: true, minlength: 3 })
  title: string;

  @Prop({ required: true, minlength: 10 })
  message: string;

  @Prop({
    required: true,
    enum: ['Maintenance', 'Feature', 'Update'],
  })
  category: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.pre('save', function (next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isActive = false;
  }
  next();
});

ActivitySchema.index({ expiresAt: 1 });
ActivitySchema.index({ category: 1 });
ActivitySchema.index({ createdAt: -1 });

ActivitySchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return this.expiresAt < new Date();
});

ActivitySchema.set('toJSON', { virtuals: true });

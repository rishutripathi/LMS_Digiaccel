import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'questions',
  autoIndex: process.env.ENVIROMENT == 'development',
})
export class Questions extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: true })
  weightage: number;
}

export const QuestionsSchema = SchemaFactory.createForClass(Questions);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MarkedAnswers } from 'src/modules/question/types/marked_answers.type';

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'tests',
  autoIndex: process.env.ENVIROMENT == 'development',
})
export class Tests extends Document {
  @Prop({ required: true })
  test_id: string;

  @Prop({ required: true })
  user: string;

  @Prop({
    required: false,
    type: [
      {
        question_id: {
          type: Types.ObjectId,
          ref: 'questions',
        },
        answer: {
          type: String,
          default: '',
        },
      },
    ],
    default: [],
    _id: false,
  })
  marked_answers: MarkedAnswers[];

  @Prop({ required: false, default: null })
  isCompleted: boolean;

  @Prop({ required: false, default: null })
  startedAt: Date;

  @Prop({ required: false, default: null })
  completedAt: Date;

  @Prop({ required: true, default: null })
  result: string;
}

export const TestSchema = SchemaFactory.createForClass(Tests);

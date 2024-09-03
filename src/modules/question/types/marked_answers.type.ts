import { Types } from 'mongoose';

export type MarkedAnswers = {
  question_id: Types.ObjectId;
  answer: string;
};

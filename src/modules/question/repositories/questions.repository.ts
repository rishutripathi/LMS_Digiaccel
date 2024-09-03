import { Injectable } from '@nestjs/common';
import { Questions } from '../entities/questions.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mongo_BaseQuestionRepository } from 'src/modules/common/repository/mongo-generic.question.repository';

@Injectable()
export class QuestionRepository extends Mongo_BaseQuestionRepository<Questions> {
  constructor(
    @InjectModel(Questions.name) private questionModel: Model<Questions>,
  ) {
    super(questionModel);
  }
}

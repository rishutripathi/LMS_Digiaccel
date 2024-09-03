import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mongo_BaseTestRepository } from 'src/modules/common/repository/mongo-generic.test.repository';
import { Tests } from '../entities/test.entity';

@Injectable()
export class TestRepository extends Mongo_BaseTestRepository<Tests> {
  constructor(@InjectModel(Tests.name) private TestModel: Model<Tests>) {
    super(TestModel);
  }
}

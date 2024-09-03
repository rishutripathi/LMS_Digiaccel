import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from '../entities/user.entity';
import { Mongo_BaseUserRepository } from 'src/modules/common/repository/mongo-generic.user.repository';

@Injectable()
export class UserRepository extends Mongo_BaseUserRepository<Users> {
  constructor(@InjectModel(Users.name) private userModel: Model<Users>) {
    super(userModel);
  }
}

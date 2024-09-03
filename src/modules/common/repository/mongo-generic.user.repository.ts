import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Mongo_BaseUserRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOneById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async update(id: string, updateDto: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async findOneByUsername(username: string): Promise<T | null> {
    return this.model.findOne({ where: { username } }).exec();
  }

  async findOneByEmail(email: string): Promise<T | null> {
    return this.model.findOne({ where: { email } }).exec();
  }

  async findOneByUsernameOrEmail(user: string): Promise<T | null> {
    return this.model
      .findOne({
        $or: [{ email: user }, { username: user }],
      })
      .exec();
  }
}

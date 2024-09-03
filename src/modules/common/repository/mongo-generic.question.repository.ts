import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Mongo_BaseQuestionRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  async createMany(createDto: any): Promise<boolean> {
    await this.model.insertMany(createDto);
    return true;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().select('-_id').exec();
  }

  async findOneById(id: string): Promise<T | null> {
    return this.model.findById(id).select('-createdAt -updatedAt').exec();
  }

  async findOneByWeightage(
    weightage: number,
    questionsAskesOfThisWeightage: number,
    attempted: number,
  ): Promise<T | null> {
    let result: T = await this.model
      .findOne({ weightage })
      .skip(attempted || questionsAskesOfThisWeightage)
      .select('-weightage -createdAt -updatedAt')
      .exec();
    result = result.toObject();
    if (result) {
      result._id = String(result._id);
    }

    return result;
  }

  async update(id: string, updateDto: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}

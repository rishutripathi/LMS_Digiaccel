import mongoose, { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Mongo_BaseTestRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  async create(createDto: any): Promise<T> {
    const createdItem = new this.model(createDto);
    return createdItem.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().select('-_id').exec();
  }

  async findOneById(id: string): Promise<T | null> {
    return this.model.findById(id).select('-createdAt -updatedAt').exec();
  }

  async findOneByTestId(id: string): Promise<T | null> {
    return this.model
      .findOne({ test_id: id })
      .select('-createdAt -updatedAt')
      .exec();
  }

  async update(id: string, updateDto: any): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async updateTestByTestId(id: string, updateDto: any): Promise<boolean> {
    this.model.updateOne({ test_id: id }, updateDto, { new: true }).exec();
    return true;
  }

  async updateQuestion_AnswerByTestId(
    test_id: string,
    question_id: string,
    updateDto: any,
  ): Promise<boolean> {
    const match_condition = {
      test_id,
      'marked_answers.question_id': new mongoose.Types.ObjectId(
        String(updateDto?.question_id || question_id),
      ),
    };

    const update_statement = {
      $set: { 'marked_answers.$[elem].answer': updateDto.answer }, // Update 'answer' if 'question_id' exists
    };

    const array_filter_statement = {
      arrayFilters: [
        {
          'elem.question_id': new mongoose.Types.ObjectId(
            String(updateDto?.question_id || question_id),
          ),
        },
      ], // Filter for the update condition
      new: true, // Creates a new document if no documents match the filter
    };

    const updateResult = await this.model
      .updateOne(match_condition, update_statement, array_filter_statement)
      .exec();

    if (updateResult['modifiedCount'] === 0) {
      await this.model
        .updateOne(
          { test_id }, // Filter by test_id
          {
            $push: {
              marked_answers: {
                question_id: new mongoose.Types.ObjectId(
                  String(updateDto?.question_id || question_id),
                ),
                answer: updateDto.answer,
              },
            }, // Push new object into the array
          },
        )
        .exec();
    }

    return true;
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}

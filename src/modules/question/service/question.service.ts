import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SeedQuestionsDto } from '../DTO/seedQuestions.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { QuestionRepository } from '../repositories/questions.repository';
import { QuestionDto } from '../DTO/question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async seedQuestionstoDBOrThrow(
    fileReadPath: SeedQuestionsDto,
  ): Promise<boolean | never> {
    const filePath = path.join(
      __filename,
      '../..',
      process.env.QUESTIONS_FILE_FOLDER,
      fileReadPath.file,
    );
    try {
      if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Either path to file or file not found');
      }
      const readStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
      });
      const maxBatchSize = 100;
      let question_batch = [];
      for await (const line of rl) {
        const questionLine = line.split(/ {3,}/);
        const questionDetail = {};
        for (const question of questionLine) {
          const lp = question.split(': ')[0];
          const rp = question.split(': ')[1];
          Object.assign(questionDetail, {
            [lp]: Number(rp) || rp,
          });
        }
        question_batch.push(questionDetail);
        if (question_batch.length <= maxBatchSize) {
          await this.questionRepository.createMany(question_batch);
          question_batch = [];
        }
      }
      if (question_batch.length > 0) {
        await this.questionRepository.createMany(question_batch);
      }

      return true;
    } catch (error) {
      throw new HttpException(error.message || error, error.status);
    }
  }

  async addQuestion(question: QuestionDto): Promise<boolean | never> {
    try {
      await this.questionRepository.create(question);

      return true;
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllQuestionsOrThrow(): Promise<QuestionDto[] | never> {
    try {
      const questions = await this.questionRepository.findAll();

      return questions;
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getQuestionByIdOrThrow(id: string): Promise<QuestionDto | never> {
    try {
      const question = await this.questionRepository.findOneById(id);

      return question;
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateQuestionByIdOrThrow(
    id: string,
    newQuestion: Partial<QuestionDto>,
  ): Promise<QuestionDto | never> {
    try {
      if (id.length != 24) {
        throw new NotFoundException('size of ID must be 24');
      }
      const question = await this.getQuestionByIdOrThrow(id);
      if (!question) {
        throw new NotFoundException('No question with this ID exists');
      }
      Object.assign(question, { ...newQuestion });
      await this.questionRepository.update(id, question);
      return question;
    } catch (error) {
      throw new HttpException(error.message || error, error.status);
    }
  }

  async deleteQuestionByIdOrThrow(id: string): Promise<boolean | never> {
    try {
      if (id.length != 24) {
        throw new NotFoundException('size of ID must be 24');
      }
      const question = await this.getQuestionByIdOrThrow(id);
      if (!question) {
        throw new NotFoundException('No question with this ID exists');
      }
      await this.questionRepository.delete(id);

      return true;
    } catch (error) {
      throw new HttpException(error.message || error, error.status);
    }
  }
}

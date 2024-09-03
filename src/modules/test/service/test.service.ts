import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestRepository } from '../repositories/test.repository';
import { v4 as uuidv4 } from 'uuid';
import { QuestionRepository } from 'src/modules/question/repositories/questions.repository';
import { StorageService } from 'src/modules/storage/services/storage.service';

@Injectable()
export class TestService {
  constructor(
    private testRepository: TestRepository,
    private questionRepository: QuestionRepository,
    private storageService: StorageService,
  ) {}

  generateUniqueTestURL(): string {
    return uuidv4();
  }

  async registerUserForTestOrThrow(user: any): Promise<string> {
    try {
      const unique_id = this.generateUniqueTestURL();
      await this.testRepository.create({
        test_id: unique_id,
        user: user.username,
      });

      return `tests/${unique_id}`;
    } catch (error) {
      throw new HttpException(
        error.message || error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async startTestOrThrow(user: any, test_id: string): Promise<void> {
    try {
      const testData = await this.testRepository.findOneByTestId(test_id);
      if (!testData) {
        throw new NotFoundException('Test not found');
      } else if (testData.isCompleted === false) {
        throw new BadRequestException('Previous test is incomplete yet');
      }
      // updating test start timestamp
      this.testRepository.updateTestByTestId(test_id, {
        isCompleted: false,
        startedAt: Date.now(),
      });
      return;
    } catch (error) {
      throw new HttpException(error.message || error, error.status);
    }
  }

  async submitAnswerForAQuestionOrThrow(
    user: any,
    test_id: string,
    questionId: string,
    answerByUser: string,
  ): Promise<any> {
    //{id: string, question: string}> {
    try {
      let currentQuestionAnswer: {
        _id: string;
        question: string;
        answer: string;
      };
      let currentDifficulty = 5,
        questionsAttempted = 0,
        consecutiveCorrectAtMaxDifficulty = 0,
        score = 0,
        isAnswerCorrect: boolean;
      if (questionId === '0') {
        // very first question -> question id is 0
        const testLastStatus =
          await this.testRepository.findOneByTestId(test_id);
        if (!testLastStatus) {
          throw new NotFoundException('Test not found');
        } else if (!testLastStatus.startedAt) {
          throw new BadRequestException("Test hasn't been started yet");
        }
        // put first question
        currentQuestionAnswer = await this.presentQuestion(
          test_id,
          currentDifficulty,
          this.storageService.getItem(`difficultyLevel-${currentDifficulty}`),
          consecutiveCorrectAtMaxDifficulty,
        );
        if (!currentQuestionAnswer) {
          throw 'Sorry! No more questions.';
        }
        this.storageService.setItem('currentDifficulty,', currentDifficulty);
        this.storageService.setItem(
          `difficultyLevel-,${currentDifficulty}`,
          this.storageService.getItem(`difficultyLevel-${currentDifficulty}`) +
            1,
        );
        this.storageService.setItem('answer', currentQuestionAnswer.answer);
      } else {
        // questions onwards
        await this.testRepository.updateQuestion_AnswerByTestId(
          test_id,
          questionId,
          { answer: answerByUser },
        );
        const answer = this.storageService.getItem('answer');
        isAnswerCorrect =
          (answerByUser?.trim().toLowerCase() ?? '') ==
          answer.trim().toLowerCase();
        currentDifficulty = Number(
          this.storageService.getItem('currentDifficulty'),
        );
        if (isAnswerCorrect) {
          // correct answer
          score += currentDifficulty;

          if (currentDifficulty === 10) {
            consecutiveCorrectAtMaxDifficulty++;
          } else {
            consecutiveCorrectAtMaxDifficulty = 0;
          }
          if (currentDifficulty < 10) {
            currentDifficulty++;
          }
        } else {
          // wrong answer
          consecutiveCorrectAtMaxDifficulty = 0;
          if (currentDifficulty > 1) {
            currentDifficulty--;
          }
        }
        this.storageService.setItem('currentDifficulty', currentDifficulty);
        currentQuestionAnswer = await this.presentQuestion(
          test_id,
          currentDifficulty,
          this.storageService.getItem(`difficultyLevel-${currentDifficulty}`),
          consecutiveCorrectAtMaxDifficulty,
        );
        if (!currentQuestionAnswer) {
          throw 'Sorry! No more questions.';
        }

        this.storageService.setItem('currentDifficulty,', currentDifficulty);
        this.storageService.setItem(
          `difficultyLevel-,${currentDifficulty}`,
          this.storageService.getItem(`difficultyLevel-${currentDifficulty}`) +
            1,
        );
        this.storageService.setItem('answer', currentQuestionAnswer.answer);
        questionsAttempted++;
        if (questionsAttempted >= 20) {
          this.storageService.clearAll();
          const result = {
            message: 'Test ended: 20 questions attempted.',
            score,
          };
          this.setResultOfThisTest(test_id, result);

          return result;
        }

        if (!isAnswerCorrect && currentDifficulty === 1) {
          this.storageService.clearAll();
          const result = {
            message: 'Test ended: Incorrect answer at difficulty 1.',
            score,
          };
          this.setResultOfThisTest(test_id, result);

          return result;
        }

        if (consecutiveCorrectAtMaxDifficulty === 3) {
          this.storageService.clearAll();
          const result = {
            message:
              'Test ended: 3 consecutive correct answers at difficulty 10.',
            score,
          };
          this.setResultOfThisTest(test_id, result);

          return result;
        }
      }

      return {
        id: currentQuestionAnswer._id,
        question: currentQuestionAnswer.question,
      };
    } catch (error) {
      throw new HttpException(
        error.message || error,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async presentQuestion(
    test_id: string,
    difficulty: number,
    questionsAskesOfThisWeightage: number,
    attempted: number,
  ): Promise<any> {
    const question = await this.questionRepository.findOneByWeightage(
      difficulty,
      questionsAskesOfThisWeightage,
      attempted,
    );
    await this.testRepository.updateQuestion_AnswerByTestId(test_id, '', {
      question_id: question._id,
    });

    return question;
  }

  async getTestDetailsOrThrow(testId: string) {
    try {
      const test = await this.testRepository.findOneByTestId(testId);
      if (!test) {
        throw new NotFoundException('Test not found');
      }
      return test;
    } catch (error) {
      throw new HttpException(
        error.message || error,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  setResultOfThisTest(
    test_id: string,
    result: { message: string; score: number },
  ) {
    this.testRepository.updateTestByTestId(test_id, {
      result: JSON.stringify(result),
    });
  }
}

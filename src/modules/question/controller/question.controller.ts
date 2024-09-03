import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/modules/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/modules/auth/enum/roles.enum';
import { RolesGuard } from 'src/modules/auth/guard/role_authorization.guard';
import { JwtAuthGuard } from 'src/modules/auth/guard/token_authentication.guard';
import { SeedQuestionsDto } from '../DTO/seedQuestions.dto';
import { QuestionService } from '../service/question.service';
import { QuestionDto } from '../DTO/question.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Questions')
@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(RoleEnum.ADMIN)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/seed')
  async seedQuestions(@Body() path: SeedQuestionsDto): Promise<string> {
    await this.questionService.seedQuestionstoDBOrThrow(path);
    return 'All questions seeded successfully';
  }

  @Post()
  async createQuestion(@Body() question: QuestionDto): Promise<string> {
    await this.questionService.addQuestion(question);
    return 'question created';
  }

  @Get()
  async getAllQuestions(): Promise<QuestionDto[]> {
    const getAllQuestions = await this.questionService.getAllQuestionsOrThrow();

    return getAllQuestions;
  }

  @Get('/:id')
  async getSingleQuestion(
    @Param('id') id: string,
  ): Promise<Pick<QuestionDto, 'question'>> {
    const getQuestions = await this.questionService.getQuestionByIdOrThrow(id);

    return getQuestions;
  }

  @Put('/:id')
  async updateSingleQuestionById(
    @Param('id') id: string,
    @Body() newQuestion: Partial<QuestionDto>,
  ): Promise<QuestionDto> {
    const getQuestions = await this.questionService.updateQuestionByIdOrThrow(
      id,
      newQuestion,
    );

    return getQuestions;
  }

  @Delete('/:id')
  async deleteSingleQuestionById(@Param('id') id: string): Promise<string> {
    await this.questionService.deleteQuestionByIdOrThrow(id);

    return 'Deleted';
  }
}

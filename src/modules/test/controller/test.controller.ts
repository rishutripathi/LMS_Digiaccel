import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from 'src/modules/auth/decorator/roles.decorator';
import { RoleEnum } from 'src/modules/auth/enum/roles.enum';
import { RolesGuard } from 'src/modules/auth/guard/role_authorization.guard';
import { JwtAuthGuard } from 'src/modules/auth/guard/token_authentication.guard';
import { TestService } from '../service/test.service';
import { ApiTags } from '@nestjs/swagger';
import { Tests } from '../entities/test.entity';

@ApiTags('tests')
@Controller('tests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('/:testId') // Retrieve the test details and results (admin only).
  @Role(RoleEnum.ADMIN)
  async getTestResults(@Param('testId') testId: string): Promise<Tests> {
    const test = await this.testService.getTestDetailsOrThrow(testId);

    return test;
  }

  @Post('auth/register')
  @Role(RoleEnum.USER)
  async registerUserForTest(@Req() req: Request): Promise<string> {
    const user = req['user'];
    const unique_url = await this.testService.registerUserForTestOrThrow(user);

    return `User registered for test successfully. Unique url: ${unique_url}`;
  }

  @Post(':testId/start')
  @Role(RoleEnum.USER)
  async startTest(
    @Req() req: Request,
    @Param('testId') testId: string,
  ): Promise<string> {
    const user = req['user'];
    await this.testService.startTestOrThrow(user, testId);

    return `Test has been started.`;
  }

  @Post(':testId/questions/:questionId/answer')
  @Role(RoleEnum.USER)
  async submitAnswerForAQuestion(
    @Req() req: Request,
    @Param('testId') testId: string,
    @Param('questionId') questionId: string,
    @Body() answerByUser: { answer: string },
  ): Promise<any> {
    const user = req['user'];
    const question = await this.testService.submitAnswerForAQuestionOrThrow(
      user,
      testId,
      questionId,
      answerByUser.answer,
    );

    return question;
  }
}

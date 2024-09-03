import { Module } from '@nestjs/common';
import { QuestionController } from './controller/question.controller';
import { QuestionService } from './service/question.service';
import { RolesGuard } from '../auth/guard/role_authorization.guard';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Questions, QuestionsSchema } from './entities/questions.entity';
import { QuestionRepository } from './repositories/questions.repository';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Questions.name,
        schema: QuestionsSchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService, RolesGuard, QuestionRepository],
})
export class QuestionModule {}

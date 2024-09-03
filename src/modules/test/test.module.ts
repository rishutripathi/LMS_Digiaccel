import { Module } from '@nestjs/common';
import { TestController } from './controller/test.controller';
import { TestService } from './service/test.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/guard/role_authorization.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Tests, TestSchema } from './entities/test.entity';
import { TestRepository } from './repositories/test.repository';
import { QuestionModule } from '../question/question.module';
import { QuestionService } from '../question/service/question.service';
import { QuestionRepository } from '../question/repositories/questions.repository';
import {
  Questions,
  QuestionsSchema,
} from '../question/entities/questions.entity';
import { StorageModule } from '../storage/storage.module';
import { StorageService } from '../storage/services/storage.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Tests.name,
        schema: TestSchema,
      },
      {
        name: Questions.name,
        schema: QuestionsSchema,
      },
    ]),
    QuestionModule,
    StorageModule,
  ],
  controllers: [TestController],
  providers: [
    TestService,
    RolesGuard,
    TestRepository,
    QuestionService,
    QuestionRepository,
    StorageService,
  ],
})
export class TestModule {}

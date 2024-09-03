import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  question: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  answer: string;

  @IsInt()
  @Min(1, { message: "weightage can't be less than 1" })
  @Max(10, { message: "weightage can't be more than 10" })
  weightage: number;
}

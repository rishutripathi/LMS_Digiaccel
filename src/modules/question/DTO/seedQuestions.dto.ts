import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SeedQuestionsDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  file: string;
}

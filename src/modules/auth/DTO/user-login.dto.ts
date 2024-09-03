import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  user: string;

  @IsStrongPassword()
  @Transform(({ value }) => value.trim())
  password: string;
}

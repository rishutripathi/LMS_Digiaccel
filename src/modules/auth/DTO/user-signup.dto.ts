import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RoleEnum } from '../enum/roles.enum';

export class UserSignupDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  username: string;

  @IsStrongPassword()
  @Transform(({ value }) => value.trim())
  password: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: "Age can't be less than 1" })
  @Max(99, { message: "Age can't be more than 99" })
  age?: number;

  @IsOptional()
  role: RoleEnum;
}

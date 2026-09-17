import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AdminRegistrationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  password: string;

  @IsNotEmpty()
  @MinLength(32)
  bootstrapToken: string;
}
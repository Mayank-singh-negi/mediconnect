import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(12)
  password: string;

  @IsIn(['patient', 'doctor'])
  role: 'patient' | 'doctor';
}

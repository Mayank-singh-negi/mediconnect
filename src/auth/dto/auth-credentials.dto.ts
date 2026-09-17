import { IsEmail, IsNotEmpty, MinLength, IsIn } from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsIn(['patient', 'doctor', 'admin'])
  role: 'patient' | 'doctor' | 'admin';
}

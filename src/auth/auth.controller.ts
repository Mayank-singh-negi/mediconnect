import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AdminRegistrationDto } from './dto/admin-registration.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthRateLimitGuard)
  @Post('register')
  async register(@Body() dto: AuthCredentialsDto) {
    return this.authService.register(dto.email, dto.password, dto.role);
  }

  @UseGuards(AuthRateLimitGuard)
  @Post('bootstrap-admin')
  async bootstrapAdmin(@Body() dto: AdminRegistrationDto) {
    return this.authService.registerAdmin(dto.email, dto.password, dto.bootstrapToken);
  }

  @UseGuards(AuthRateLimitGuard)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user;
  }
}

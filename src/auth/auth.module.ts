import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { SecurityModule } from '../security/security.module';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRateLimitGuard } from './auth-rate-limit.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SecurityModule],
  providers: [UsersService, AuthService, AuthRateLimitGuard],
  controllers: [AuthController],
  exports: [UsersService, AuthService, AuthRateLimitGuard],
})
export class AuthModule {}

import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(email: string, password: string, role: 'patient' | 'doctor' | 'admin') {
    if (role === 'admin') {
      throw new ForbiddenException('Admin accounts must use the bootstrap flow');
    }
    return this.createAuthenticatedUser(email, password, role);
  }

  async registerAdmin(email: string, password: string, bootstrapToken: string) {
    const configuredToken = process.env.ADMIN_BOOTSTRAP_TOKEN;
    if (!configuredToken || !this.secureCompare(bootstrapToken, configuredToken)) {
      throw new ForbiddenException('Invalid admin bootstrap token');
    }

    if (await this.usersService.countByRole('admin')) {
      throw new ConflictException('An admin account already exists');
    }

    return this.createAuthenticatedUser(email, password, 'admin');
  }

  private async createAuthenticatedUser(email: string, password: string, role: 'patient' | 'doctor' | 'admin') {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.usersService.findByEmail(normalizedEmail);
    if (existing) {
      throw new ConflictException('User already exists');
    }
    const user = await this.usersService.createUser(normalizedEmail, password, role);
    const token = this.signToken(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email.trim().toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }

  private signToken(userId: string, role: string) {
    const secret = this.getJwtSecret();
    return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' });
  }

  private getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters');
    }
    return secret;
  }

  private secureCompare(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);
    if (leftBuffer.length !== rightBuffer.length) {
      return false;
    }
    return require('node:crypto').timingSafeEqual(leftBuffer, rightBuffer);
  }
}

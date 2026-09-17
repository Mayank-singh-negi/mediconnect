import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(email: string, password: string, role: 'patient' | 'doctor' | 'admin') {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('User already exists');
    }
    const user = await this.usersService.createUser(email, password, role);
    const token = this.signToken(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.signToken(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, token };
  }

  private signToken(userId: string, role: string) {
    const secret = process.env.JWT_SECRET ?? 'development-secret';
    return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' });
  }
}

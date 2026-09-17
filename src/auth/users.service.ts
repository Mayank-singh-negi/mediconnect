import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(email: string, password: string, role: User['role']): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const partial: Partial<User> = { email, passwordHash, role };
    const user = this.usersRepo.create(partial);
    const saved = await this.usersRepo.save(user as any);
    return saved as User;
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }
}

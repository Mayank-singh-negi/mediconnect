jest.mock('@nestjs/common', () => ({
  Injectable: () => (target: any) => target,
  ConflictException: class ConflictException extends Error {},
  ForbiddenException: class ForbiddenException extends Error {},
  UnauthorizedException: class UnauthorizedException extends Error {},
}));

jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { AuthService } from './auth.service';

describe('AuthService', () => {
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalBootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN;

  afterEach(() => {
    process.env.JWT_SECRET = originalJwtSecret;
    process.env.ADMIN_BOOTSTRAP_TOKEN = originalBootstrapToken;
    jest.restoreAllMocks();
  });

  it('does not allow public admin registration', async () => {
    const usersService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    const service = new AuthService(usersService as any);

    await expect(service.register('admin@example.com', 'strong-password', 'admin' as any))
      .rejects.toThrow('Admin accounts must use the bootstrap flow');
    expect(usersService.createUser).not.toHaveBeenCalled();
  });

  it('allows the first admin only with the configured bootstrap token', async () => {
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.ADMIN_BOOTSTRAP_TOKEN = 'b'.repeat(32);
    const usersService = {
      findByEmail: jest.fn().mockResolvedValue(null),
      countByRole: jest.fn().mockResolvedValue(0),
      createUser: jest.fn().mockResolvedValue({ id: 'admin-1', email: 'admin@example.com', role: 'admin' }),
    };
    const service = new AuthService(usersService as any);

    const result = await service.registerAdmin('ADMIN@example.com', 'strong-password', 'b'.repeat(32));

    expect(result.user).toEqual({ id: 'admin-1', email: 'admin@example.com', role: 'admin' });
    expect(usersService.createUser).toHaveBeenCalledWith('admin@example.com', 'strong-password', 'admin');
  });

  it('rejects admin bootstrap after an admin already exists', async () => {
    process.env.ADMIN_BOOTSTRAP_TOKEN = 'b'.repeat(32);
    const usersService = {
      countByRole: jest.fn().mockResolvedValue(1),
      findByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    const service = new AuthService(usersService as any);

    await expect(service.registerAdmin('admin@example.com', 'strong-password', 'b'.repeat(32)))
      .rejects.toThrow('An admin account already exists');
    expect(usersService.findByEmail).not.toHaveBeenCalled();
  });
});
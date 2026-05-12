import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ token: 'test-token' }),
            register: jest
              .fn()
              .mockResolvedValue({ id: 1, username: 'test-user' }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token', async () => {
      const result = await authController.login({
        email: 'test',
        password: 'test',
      });
      expect(result).toEqual({ token: 'test-token' });
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test',
        password: 'test',
      });
    });
  });

  describe('register', () => {
    it('should return the registered user', async () => {
      const result = await authController.register({
        name: 'test',
        email: 'test',
        password: 'test',
      });
      expect(result).toEqual({ id: 1, name: 'test', email: 'test' });
      expect(authService.register).toHaveBeenCalledWith({
        email: 'test',
        password: 'test',
      });
    });
  });
});

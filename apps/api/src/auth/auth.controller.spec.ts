import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthProvider } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access token for valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        authProvider: AuthProvider.EMAIL_PASSWORD,
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      };

      const mockToken = {
        access_token: 'mock.jwt.token',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockToken);

      const result = await controller.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockAuthService.validateUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(
        controller.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should create new user and return user data', async () => {
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        name: 'New User',
        authProvider: AuthProvider.EMAIL_PASSWORD,
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register({
        email: 'new@example.com',
        password: 'password',
        name: 'New User',
      });

      expect(result).toEqual(mockUser);
      expect(authService.register).toHaveBeenCalledWith(
        'new@example.com',
        'password',
        'New User',
      );
    });
  });
}); 
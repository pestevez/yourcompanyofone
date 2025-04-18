import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '@yourcompanyofone/database';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    organization: {
      create: jest.fn(),
    },
    organizationPlan: {
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        authProvider: AuthProvider.EMAIL_PASSWORD,
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        authProvider: AuthProvider.EMAIL_PASSWORD,
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException for wrong auth provider', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        authProvider: AuthProvider.GOOGLE,
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).rejects.toThrow('Please use the correct login method');
    });
  });

  describe('register', () => {
    it('should register a new user and create organization', async () => {
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

      const mockPlan = {
        id: '1',
        name: 'Free',
      };

      mockPrismaService.organizationPlan.findUnique.mockResolvedValue(mockPlan);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(
        'new@example.com',
        'password',
        'New User',
      );

      expect(result).toEqual(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          password: 'hashedPassword',
          name: 'New User',
          authProvider: AuthProvider.EMAIL_PASSWORD,
          organizations: {
            create: {
              organization: {
                create: {
                  name: "New User's Organization",
                  plan: {
                    connect: {
                      name: 'Free',
                    },
                  },
                },
              },
            },
          },
        },
        include: {
          organizations: {
            include: {
              organization: true,
            },
          },
        },
      });
    });
  });

  describe('login', () => {
    it('should return JWT token for valid user', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        organizations: [
          {
            organization: { id: 'org1' },
          },
        ],
      };

      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '1',
        email: 'test@example.com',
        organizationId: 'org1',
      });
    });
  });
}); 
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      validateUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });


  describe('signup', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: 1, mobile: '1234567890', name: 'John Doe' };
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);

      const result = await authService.signup('1234567890', 'John Doe', 'password');

      expect(result).toEqual({
        message: 'Registration successfully',
        user: {
          id: mockUser.id,
          mobile: mockUser.mobile,
          name: mockUser.name,
        },
      });
      expect(usersService.create).toHaveBeenCalledWith('1234567890', 'John Doe', 'password');
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      jest.spyOn(usersService, 'create').mockRejectedValue(new Error('Unexpected error'));

      await expect(authService.signup('1234567890', 'John Doe', 'password')).rejects.toThrow(InternalServerErrorException);
    });
  });


  describe('login', () => {
    it('should login a user and return an access token', async () => {
      const mockUser = { id: 1, mobile: '1234567890', name: 'John Doe' };
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await authService.login('1234567890', 'password');

      expect(result).toEqual({
        message: 'Login successful',
        access_token: 'mocked_token',
        user: {
          id: mockUser.id,
          mobile: mockUser.mobile,
          name: mockUser.name,
        },
      });
      expect(usersService.validateUser).toHaveBeenCalledWith('1234567890', 'password');
      expect(jwtService.sign).toHaveBeenCalledWith({ mobile: mockUser.mobile, sub: mockUser.id });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(null);

      await expect(authService.login('1234567890', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      jest.spyOn(usersService, 'validateUser').mockRejectedValue(new Error('Unexpected error'));

      await expect(authService.login('1234567890', 'password')).rejects.toThrow(InternalServerErrorException);
    });
  });
});

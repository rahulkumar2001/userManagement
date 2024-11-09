
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should call AuthService.signup with correct parameters', async () => {
      const signupDto: SignupRequestDto = { mobile: '1234567890', name: 'John Doe', password: 'securePassword' };
      const signupResponse = { id: 'userId', name: signupDto.name, mobile: signupDto.mobile };
      jest.spyOn(authService, 'signup').mockResolvedValue(signupResponse);

      const result = await authController.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(signupDto.mobile, signupDto.name, signupDto.password);
      expect(result).toEqual(signupResponse);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters', async () => {
      const loginDto: LoginDto = { mobile: '1234567890', password: 'securePassword' };
      const loginResponse = { token: 'jwtToken' };
      jest.spyOn(authService, 'login').mockResolvedValue(loginResponse);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto.mobile, loginDto.password);
      expect(result).toEqual(loginResponse);
    });
  });
});

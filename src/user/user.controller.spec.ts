import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };

  const mockAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser; 
      return true; 
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard) 
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should return the user profile', () => {
    const req = { user: mockUser };
    expect(controller.getProfile(req)).toEqual(mockUser);
  });
});

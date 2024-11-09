import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(mobile: string, name: string, password: string) {
    try{
      const newUser = await this.usersService.create(mobile, name, password);
      return {
        message: 'Registration successfully',
        user: {
          id: newUser.id,
          mobile: newUser.mobile,
          name: newUser.name,
        },
      };
    }
    catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while signing up. Please try again.');
    }
  }


  async login(mobile: string, password: string) {
    try{
      const user = await this.usersService.validateUser(mobile, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { mobile: user.mobile, sub: user.id };
      const token = this.jwtService.sign(payload);
  
      return {
        message: 'Login successful',
        access_token: token,
        user: {
          id: user.id,
          mobile: user.mobile,
          name: user.name,
        },
      };
    }
    catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred while signing up. Please try again.');
    }
  }
}

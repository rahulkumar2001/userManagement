import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupRequestDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({summary: "user registration"})
  @UsePipes(new ValidationPipe({transform: true}))
  async signup(@Body() signupDto: SignupRequestDto) {
    return this.authService.signup(signupDto.mobile, signupDto.name, signupDto.password);
  }


  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.mobile, loginDto.password);
  }
}

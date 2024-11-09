// src/signup-request.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, IsBoolean, IsOptional, IsNumber, IsNumberString, IsMobilePhone } from 'class-validator';

export class SignupRequestDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The mobile number of the user',
    example: '9876543210',
  })
  @IsNumberString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Mobile number must be a 10-digit number starting with 6, 7, 8, or 9',
  })
  mobile: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, { message: 'Password must be between 4 and 20 characters long' })
  password: string;

  @ApiProperty({
    description: 'The status of the user',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty({
    description: 'The IP address of the user, if provided',
    example: '192.168.1.1',
    required: false,
  })
  @IsString()
  @IsOptional()
  ip_address?: string;
}

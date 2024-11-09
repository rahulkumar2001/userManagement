import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The mobile number of the user',
    example: '9876543210',
  })
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Mobile number must be a 10-digit number' })
  mobile: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Password1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20, { message: 'Password must be between 4 and 20 characters long' })
  password: string;
}

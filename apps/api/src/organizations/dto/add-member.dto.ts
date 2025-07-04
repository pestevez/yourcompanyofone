import { IsString, IsNotEmpty, IsEmail, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberDto {
  @ApiProperty({
    description: 'Member email address',
    example: 'member@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Member role in the organization',
    example: 'MEMBER',
    enum: ['ADMIN', 'MEMBER'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMIN', 'MEMBER'])
  role: string;
} 
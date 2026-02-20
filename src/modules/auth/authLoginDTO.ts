import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Login é brigatório' })
  login: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Senha é brigatória' })
  @IsString()
  password: string;
}

export class ResLoginDto {
  @ApiProperty()
  @IsString()
  access_token: string;
}

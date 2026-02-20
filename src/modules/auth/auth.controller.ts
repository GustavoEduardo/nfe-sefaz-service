import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './authLoginDTO';
import { Public } from 'src/modules/common/decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Faz o login e retorna access_token (JWT)',
  })
  @ApiBody({ type: AuthLoginDto })
   @ApiResponse({
      status: 201,
      description: '',
      schema: {
        example: {
          access_token: "string_access_token",
        }
      }
    })
  login(@Body() data: AuthLoginDto) {
    return this.authService.login(data);
  }
}

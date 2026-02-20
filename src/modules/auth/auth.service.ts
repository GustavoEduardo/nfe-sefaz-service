import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './authLoginDTO';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(data: AuthLoginDto): Promise<{ access_token: string }> {
    // Colocaria em um módulo separado em um projeto maior:
    // const user = await this.userService.findToLogin(data.login) ;

    const user = await this.findToLogin(data.login);

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    const payload = {
      sub: user.id,
      login: user.login,
      nome: user.name,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

   async findToLogin(login: string) {
    const user = await this.prisma.user.findFirst({
      where: { login, deletedAt: null },
      select: {
        id: true,
        login: true,
        password: true,
        name: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    return user;
  }

}

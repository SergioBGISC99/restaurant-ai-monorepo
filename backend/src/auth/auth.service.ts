import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { bcryptAdapter } from 'src/config/bcrypt.adapter';
import { Role } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) throw new UnauthorizedException('Email ya registrado');

    const hashedPassword = bcryptAdapter.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.USUARIO,
      },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = bcryptAdapter.compare(data.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    return this.signToken(user.id, user.email, user.role);
  }

  private signToken(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

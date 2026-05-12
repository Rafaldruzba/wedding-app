import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type SafeUser = Pick<User, 'id' | 'email' | 'name' | 'createdAt'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private signToken(user: SafeUser) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }

  private toSafeUser(user: User): SafeUser {
    const { id, email, name, createdAt } = user;
    return { id, email, name, createdAt };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new BadRequestException('Konto z takim mailem już istnieje');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.client.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const safeUser = this.toSafeUser(user);

    return {
      user: safeUser,
      accessToken: this.signToken(safeUser),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Błędny email lub hasło');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.password);

    if (!passwordOk) {
      throw new UnauthorizedException('Błędny email lub hasło');
    }

    const safeUser = this.toSafeUser(user);

    return {
      user: safeUser,
      accessToken: this.signToken(safeUser),
    };
  }
}
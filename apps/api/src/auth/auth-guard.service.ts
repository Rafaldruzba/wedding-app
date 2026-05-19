import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuardService {
  constructor(private readonly jwtService: JwtService) {}

  verifyToken(authHeader: string): {
    sub: string;
    email: string;
    name: string;
  } {
    if (!authHeader) {
      throw new UnauthorizedException('Brakuje autoryzacji');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Nieprawidłowy format tokenu');
    }

    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Nieprawidłowy token');
    }
  }
}

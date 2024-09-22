import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; // Exclude password from returned user object
      return result; // Return user data without password
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generate JWT for the user
  async login(user: any) {
    const payload = { email: user.email, sub: user.id }; // Token payload
    return {
      success: true,
      access_token: this.jwtService.sign(payload), // Sign and return the JWT token
      user: user,
    };
  }

  async verifyToken(token: string) {
    console.log('verify token', token);
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      return { valid: true, user };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

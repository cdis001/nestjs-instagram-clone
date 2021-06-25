import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(accountName: string, password: string) {
    const user = await this.userService.findByAccountName(accountName);
    if (user && user.password === password) {
      //result에 password 제외
      const { password, ...result } = user;

      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

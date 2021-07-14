import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(accountName: string, plainTextPassword: string) {
    try {
      const user = await this.userService.findByAccountName(accountName);
      await this.verifyPassword(plainTextPassword, user.password);
      const { password, ...result } = user;

      return result;
    } catch (error) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);

    if (!isMatch) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User) {
    const { accountName } = user;
    let newUser = await this.userService.findByAccountName(accountName);

    if (newUser) {
      throw new HttpException(
        '이미 사용하고 있는 아이디입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    try {
      const {password, ...returnUser} = await this.userService.create({
        ...user,
        password: hashedPassword
      })

      return returnUser
    } catch(error) {
      console.log(error)
      throw new HttpException(
        '회원가입에 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getAccessToken(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME})
    
    return {
      accessToken,
      httpOnly: true,
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME) * 1000
    }
  }

  getRefreshToken(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME})
    
    return {
      refreshToken,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME) * 1000
    }
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
      refreshOption: {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        maxAge: 0,
      },
    };
  }

}

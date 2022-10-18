import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FollowsService } from 'src/follows/follows.service';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private followsService: FollowsService,
  ) {}

  async validateUser(userId: string, plainTextPassword: string) {
    try {
      const user = await this.userService.findByUserId(userId);

      await this.verifyPassword(plainTextPassword, user.password);
      const { password, refreshToken, ...result } = user;

      return result;
    } catch (error) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(userId: string, plainTextPassword: string) {
    try {
      const user = await this.validateUser(userId, plainTextPassword);
      const follower = await this.followsService.findByFollowingId(user.id);
      const following = await this.followsService.findByFollowerId(user.id);

      return { userInfo: user, follower, following };
    } catch (error) {
      throw new HttpException('로그인에 실패했습니다.', HttpStatus.BAD_REQUEST);
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

  // async login(user: any) {
  //   const payload = { accountName: user.accountName, sub: user.id };
  //   const follower = await this.followsService.findByFollowerId(user.id);

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     follower,
  //   };
  // }

  async register(user: User) {
    const { accountName, email } = user;
    let newUser = await this.userService.findByAccountNameAndEmail(
      accountName,
      email,
    );

    if (newUser) {
      throw new HttpException(
        '이미 사용하고 있는 아이디입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    try {
      const { password, ...returnUser } = await this.userService.create({
        ...user,
        password: hashedPassword,
      });

      return returnUser;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '회원가입에 실패했습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async emailValidation(email: string) {
    let newUser = await this.userService.findByEmail(email);

    let message = '';
    let code = false;

    if (newUser) {
      message = '이미 사용하고 있는 이메일입니다.';
      code = false;
    } else {
      message = '사용 가능한 이메일입니다.';
      code = true;
    }
    return { code, message };
  }

  async phoneNumberValidation(phoneNumber: string) {
    let newUser = await this.userService.findByPhoneNumber(phoneNumber);

    let message = '';
    let code = false;

    if (newUser) {
      message = '이미 사용하고 있는 전화번호입니다.';
      code = false;
    } else {
      message = '사용 가능한 전화번호입니다.';
      code = true;
    }
    return { code, message };
  }

  async accountNameValidation(accountName: string) {
    let newUser = await this.userService.findByAccountName(accountName);

    let message = '';
    let code = false;

    if (newUser) {
      message = '이미 사용하고 있는 사용자 이름입니다.';
      code = false;
    } else {
      message = '사용 가능한 사용자 이름입니다.';
      code = true;
    }
    return { code, message };
  }

  getAccessToken(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return {
      accessToken,
      httpOnly: true,
      maxAge: Number(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME),
    };
  }

  getRefreshToken(user: any) {
    const payload = { accountName: user.accountName, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return {
      refreshToken,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
    };
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

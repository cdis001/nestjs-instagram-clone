import { Body, Controller, Get, Post, Param, Req, Res } from '@nestjs/common';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.body;
    const { userId, password } = user;

    const { userInfo, follower, following } = await this.authService.login(
      userId,
      password,
    );

    const { accessToken, ...accessOption } =
      this.authService.getAccessToken(userInfo);

    const { refreshToken, ...refreshOption } =
      this.authService.getRefreshToken(userInfo);

    await this.usersService.setCurrentRefreshToken(refreshToken, userInfo.id);

    res.cookie('Authorization', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    const result = { ...userInfo, accessToken, follower, following };
    // console.log(result);

    return result;
  }

  @Post('register')
  async register(@Body() user: User): Promise<any> {
    return this.authService.register(user);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.body;
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.usersService.removeRefreshToken(user.id);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
  }

  @Get('emailValidation/:email')
  async emailValidation(@Param('email') email: string) {
    return await this.authService.emailValidation(email);
  }

  @Get('accountNameValidation/:accountName')
  async accountNameValidation(@Param('accountName') accountName: string) {
    return await this.authService.accountNameValidation(accountName);
  }

  @Get('phoneNumberValidation/:phoneNumber')
  async phoneNumberValidation(@Param('phoneNumber') phoneNumber: string) {
    return await this.authService.phoneNumberValidation(phoneNumber);
  }
}

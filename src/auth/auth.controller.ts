import { Body, Controller, Post, Req, Res } from '@nestjs/common';

import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.body;
    const { accountName, password } = user;

    const userInfo = await this.authService.validateUser(accountName, password);

    const { accessToken, ...accessOption } =
      this.authService.getAccessToken(userInfo);

    const { refreshToken, ...refreshOption } = this.authService.getRefreshToken(userInfo);

    await this.usersService.setCurrentRefreshToken(refreshToken, userInfo.id)

    res.cookie('Authorization', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);

    return userInfo;
  }

  @Post('register')
  async register(@Body() user: User): Promise<any> {
    return this.authService.register(user);
  }

  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.body
    const {
        accessOption,
        refreshOption,
      } = this.authService.getCookiesForLogOut();
  
      await this.usersService.removeRefreshToken(user.id);
  
      res.cookie('Authentication', '', accessOption);
      res.cookie('Refresh', '', refreshOption);
  }
}

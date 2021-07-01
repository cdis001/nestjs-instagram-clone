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
      await this.authService.getAccessToken(userInfo);

    const { refreshToken, ...refreshOption } = await this.authService.getRefreshToken(userInfo);

    await this.usersService.setCurrentRefreshToken(refreshToken, userInfo.id)

    await res.cookie('Authorization', accessToken, accessOption);
    await res.cookie('Refresh', refreshToken, refreshOption);

    return user;
  }

  @Post('register')
  async register(@Body() user: User): Promise<any> {
    return this.authService.register(user);
  }
}

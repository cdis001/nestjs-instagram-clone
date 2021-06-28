import { Body, Controller, Post, Request } from '@nestjs/common';

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
    async login(@Request() req) {
        const {accountName, password} = req.body;
        await this.authService.validateUser(accountName, password);
        return this.authService.login(req.body);
    }

    @Post('register')
    async register(@Body() user: User): Promise<any> {
        return this.authService.register(user);
    }
}

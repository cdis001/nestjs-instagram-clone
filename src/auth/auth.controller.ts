import { Controller, Post, Request } from '@nestjs/common';

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
        return this.authService.login(req.body);
    }
}

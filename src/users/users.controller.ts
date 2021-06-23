import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from './user.entity';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    getById(@Param() id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post('signup')
    signup(@Body() user: User): Promise<any> {
        return this.usersService.create(user);
    }
}

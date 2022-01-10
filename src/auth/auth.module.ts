import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FollowsService } from 'src/follows/follows.service';
import { FollowsModule } from 'src/follows/follows.module';
require('dotenv').config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    FollowsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    JwtStrategy,
    FollowsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersService: UsersService) {
    super({
        jwtFromRequest:
          ExtractJwt.fromExtractors([
            (request) => {
              return request?.cookies?.Authorization;
            },
          ]) || ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET_KEY,
    });
  }

  async validate(payload: any) {
      const {accountName} = payload
      const user = await this.usersService.findByAccountName(accountName);

      if(!user) throw new UnauthorizedException()

    return user
  }
}

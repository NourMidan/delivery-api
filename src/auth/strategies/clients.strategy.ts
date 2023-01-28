import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class ClientStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: 'secret701',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.authService.validateUser(payload.id);
    if (user.targetType !== 'client') {
      throw new UnauthorizedException();
    }

    return user;
  }
}

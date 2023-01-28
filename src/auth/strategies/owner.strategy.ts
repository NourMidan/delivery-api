import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class OwnerStrategy extends PassportStrategy(Strategy, 'owner') {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: 'secret701',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { id: string }) {
    const user = await this.authService.validateUser(payload.id);
    if (user.targetType !== 'owner') {
      throw new UnauthorizedException();
    }
    return user;
  }
}

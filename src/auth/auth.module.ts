import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsService } from '../clients/clients.service';
import { OwnersService } from '../owners/owners.service';
import { UsersService } from '../users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { OwnerStrategy } from './strategies/owner.strategy';
import { ClientStrategy } from './strategies/clients.strategy';
import { ClientsRepository } from '../clients/clients.respository';
import { CartsRepository } from '../cart/carts.respository';
import { OwnersRepository } from '../owners/owners.respository';
import { MenusRepository } from '../menu/menu.respository';
import { UsersRepository } from '../users/users.respository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret701',
      signOptions: {
        expiresIn: 7776000,
      },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthService,
    ClientsService,
    OwnersService,
    UsersService,
    LocalStrategy,
    OwnerStrategy,
    ClientStrategy,
    ClientsRepository,
    CartsRepository,
    OwnersRepository,
    MenusRepository,
    UsersRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

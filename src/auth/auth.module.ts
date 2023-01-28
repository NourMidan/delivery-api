import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsService } from 'src/clients/clients.service';
import { OwnersService } from 'src/owners/owners.service';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { OwnerStrategy } from './strategies/owner.strategy';
import { ClientStrategy } from './strategies/clients.strategy';
import { ClientsRepository } from 'src/clients/clients.respository';
import { CartsRepository } from 'src/cart/carts.respository';
import { OwnersRepository } from 'src/owners/owners.respository';
import { MenusRepository } from 'src/menu/menu.respository';
import { UsersRepository } from 'src/users/users.respository';

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

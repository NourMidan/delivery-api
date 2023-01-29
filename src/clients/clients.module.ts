import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { ClientsService } from './clients.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { Cart } from '../cart/entities/cart.entity';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ClientsRepository } from './clients.respository';
import { CartsRepository } from '../cart/carts.respository';
import { UsersRepository } from '../users/users.respository';
@Module({
  controllers: [ClientsController],
  providers: [
    ClientsService,
    UsersService,
    ClientsRepository,
    CartsRepository,
    UsersRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([Client, Cart, User]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret701',
      signOptions: {
        expiresIn: 7776000,
      },
    }),
  ],
  exports: [ClientsService],
})
export class ClientsModule {}

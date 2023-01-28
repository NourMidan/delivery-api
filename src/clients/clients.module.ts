import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { Client } from './entities/client.entity';
import { ClientsService } from './clients.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ClientsRepository } from './clients.respository';
import { CartsRepository } from 'src/cart/carts.respository';
import { UsersRepository } from 'src/users/users.respository';
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

import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Item } from '../item/entities/item.entity';
import { Menu } from '../menu/entities/menu.entity';
import { ItemsRepository } from '../item/items.respository';
import { CartsRepository } from './carts.respository';

@Module({
  controllers: [CartController],
  providers: [CartService, CartsRepository, ItemsRepository],
  imports: [
    TypeOrmModule.forFeature([Cart, Item, Menu]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class CartModule {}

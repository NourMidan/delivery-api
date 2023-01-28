import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Item } from 'src/item/entities/item.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { ItemsRepository } from 'src/item/items.respository';
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

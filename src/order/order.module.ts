import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { Item } from '../item/entities/item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { OrdersRepository } from './order.respository';
import { CartsRepository } from '../cart/carts.respository';
import { ItemsRepository } from '../item/items.respository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrdersRepository, CartsRepository, ItemsRepository],
  imports: [
    TypeOrmModule.forFeature([Order, Item, Cart]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class OrderModule {}

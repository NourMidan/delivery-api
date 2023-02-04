import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { UserWithUserable } from '../auth/auth-interfaces';
import { CartsRepository } from '../cart/carts.respository';
import { ItemsRepository } from '../item/items.respository';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './order.respository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly cartRepository: CartsRepository,
  ) {}

  async create(user: UserWithUserable) {
    const order = this.orderRepository.create({
      menu: user.userable['cart'].menuId,
      client: user.userable,
      items: user.userable['cart'].items,
    });

    const newOrder = await this.orderRepository.save(order);

    if (newOrder) {
      await this.clearCart(user);
    }
    return newOrder;
  }

  async findOne(id: string) {
    return await this.orderRepository.findOne({
      where: { id },
      relations: { menu: true, client: true },
    });
  }

  async getClientOrders(user: UserWithUserable) {
    return await this.orderRepository.find({
      where: { client: { id: user.userable.id } },
    });
  }

  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
    user: UserWithUserable,
  ) {
    const order = await this.findOne(id);
    if (!order) throw new ConflictException('order does not exist');
    const { status } = updateOrderDto;
    if (order.menu.id !== user.userable['menu'].id) {
      throw new UnauthorizedException('unauthorized');
    } else {
      return await this.orderRepository.update(id, { status });
    }
  }

  async clearCart(user: UserWithUserable) {
    const { id } = user.userable['cart'];
    const cart = await this.cartRepository.findOneBy({ id });
    cart.items = [];
    cart.menuId = '';
    return await this.cartRepository.save(cart);
  }
}

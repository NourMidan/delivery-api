import { ConflictException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { UserWithUserable } from '../auth/auth-interfaces';
import { Client } from '../clients/entities/client.entity';
import { ItemsRepository } from '../item/items.respository';
import { CartsRepository } from './carts.respository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly itemRepository: ItemsRepository,
  ) {}

  async getClientCart(client: UserWithUserable) {
    const { id } = client.userable['cart'];

    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
      });

      return { ...cart };
    } catch (error) {
      throw new UnauthorizedException('unauthorized');
    }
  }
  async addToCart(body: { item: string }, client: UserWithUserable) {
    const { item } = body;
    const { id } = client.userable['cart'];
    const fetchItem = await this.itemRepository.findOne({
      where: { id: item },
      relations: { menu: true },
    });

    if (!fetchItem) {
      throw new ConflictException(`item doesn't exist`);
    }

    const cart = await this.cartRepository.findOneBy({ id });

    if (cart.items.length === 0) {
      cart.items = [fetchItem];
      cart.menuId = fetchItem.menu.id;
      return await this.cartRepository.save(cart);
    } else if (fetchItem.menu.id === cart.menuId) {
      cart.items = [...cart.items, fetchItem];
      return await this.cartRepository.save(cart);
    } else {
      await this.clear(client.userable as Client);
      cart.items = [fetchItem];
      cart.menuId = fetchItem.menu.id;
      return await this.cartRepository.save(cart);
    }
  }
  async removeFromCart(body: { item: string }, client: UserWithUserable) {
    const { id } = client.userable['cart'];
    const { item } = body;
    const cart = await this.cartRepository.findOneBy({ id });

    console.log('client', client);
    if (cart.items.length === 1) {
      return await this.clear(client.userable as Client);
    } else {
      const result = cart.items.filter((i) => i.id != item);

      cart.items = result;
      return await this.cartRepository.save(cart);
    }
  }

  async create() {
    const newCart = this.cartRepository.create();
    const cart = await this.cartRepository.save(newCart);

    return cart;
  }

  async clear(client: Client) {
    const { id } = client.cart;
    const cart = await this.cartRepository.findOneBy({ id });
    cart.items = [];
    cart.menuId = '';
    return await this.cartRepository.save(cart);
  }
}

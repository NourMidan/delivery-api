import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { UserWithUserable } from '../auth/auth-interfaces';
import { GetUser } from '../auth/user.decorator';
import { ClientAuthGuard } from '../auth/guards/client-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Client } from '../clients/entities/client.entity';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtAuthGuard)
@UseGuards(ClientAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getUserCart(@GetUser() client: UserWithUserable) {
    return this.cartService.getClientCart(client);
  }

  @Patch('/add')
  addToCart(
    @Body() body: { item: string },
    @GetUser() client: UserWithUserable,
  ) {
    return this.cartService.addToCart(body, client);
  }
  @Patch('/remove')
  removeFromCart(
    @Body() body: { item: string },
    @GetUser() client: UserWithUserable,
  ) {
    return this.cartService.removeFromCart(body, client);
  }

  @Post('/clear')
  clear(@GetUser() client: Client) {
    return this.cartService.clear(client);
  }
}

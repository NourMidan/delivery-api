import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetUser } from 'src/auth/user.decorator';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { OwnerAuthGuard } from 'src/auth/guards/owner-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientAuthGuard)
  @Post('/create')
  create(@GetUser() user: UserWithUserable) {
    // const itemsArray = user.userable['cart'].items.reduce(
    //   (accumulator: number[], currentValue: { id: number }) =>
    //     accumulator.concat(currentValue.id),
    //   [],
    // );
    return this.orderService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientAuthGuard)
  @Get('/list')
  getClientOrders(@GetUser() user: UserWithUserable) {
    return this.orderService.getClientOrders(user);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.orderService.findOne(id);
  // }

  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: UserWithUserable,
  ) {
    return this.orderService.update(id, updateOrderDto, user);
  }
}

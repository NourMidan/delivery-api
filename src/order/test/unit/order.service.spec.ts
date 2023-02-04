import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartsRepository } from 'src/cart/carts.respository';
import { Status } from 'src/order/entities/order.entity';
import { OrdersRepository } from 'src/order/order.respository';
import { OrderService } from 'src/order/order.service';
import {
  orderStub,
  updateOrderDto,
  userWithClientStub,
  userWithOwnerStub,
} from './stubs/order.stub';
import { mockOrderRepository } from './__mocks__/order.mock';

describe('order service', () => {
  let orderService: OrderService;
  let orderRepository: OrdersRepository;
  let cartRepository: CartsRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrdersRepository),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(CartsRepository),
          useValue: {},
        },
      ],
    }).compile();
    orderService = module.get<OrderService>(OrderService);
    orderRepository = module.get<OrdersRepository>(OrdersRepository);
    cartRepository = module.get<CartsRepository>(CartsRepository);
  });

  it('should be defined ', () => {
    expect(orderService).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  test('create order', async () => {
    const createSpy = jest
      .spyOn(orderRepository, 'create')
      .mockReturnValue(orderStub);

    const saveSpy = jest
      .spyOn(orderRepository, 'save')
      .mockResolvedValue({ ...orderStub, id: 'orderId' });

    const clearSpy = jest
      .spyOn(orderService, 'clearCart')
      .mockResolvedValue(null);

    const expected = await orderService.create(userWithClientStub);

    expect(expected).toEqual({ ...orderStub, id: 'orderId' });
    expect(createSpy).toBeCalledWith({
      menu: userWithClientStub.userable['cart'].menuId,
      client: userWithClientStub.userable,
      items: userWithClientStub.userable['cart'].items,
    });
    expect(saveSpy).toBeCalled();
    expect(clearSpy).toBeCalled();
  });
  test('update order', async () => {
    const createSpy = jest
      .spyOn(orderRepository, 'findOne')
      .mockResolvedValue(orderStub);

    const updateSpy = jest
      .spyOn(orderRepository, 'update')
      .mockImplementation((id, data) => {
        orderStub.status = data.status as Status;
        return null;
      });

    const expected = await orderService.update(
      'orderId',
      updateOrderDto,
      userWithOwnerStub,
    );

    expect(orderStub.status).toEqual(updateOrderDto.status);

    expect(createSpy).toBeCalledWith({
      relations: { client: true, menu: true },
      where: { id: 'orderId' },
    });
    expect(updateSpy).toBeCalledWith('orderId', updateOrderDto);
  });
});

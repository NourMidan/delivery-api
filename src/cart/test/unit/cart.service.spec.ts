import { Test } from '@nestjs/testing';
import { CartService } from 'src/cart/cart.service';
import { CartsRepository } from 'src/cart/carts.respository';
import { Cart } from 'src/cart/entities/cart.entity';
import { ItemsRepository } from 'src/item/items.respository';
import {
  cartStub,
  clientStub,
  itemOnCartStub,
  itemStub,
  userWithClientStub,
} from './stubs/cart.stub';
import { mockCartRepository, mockItemsRepository } from './__mocks__/cart.mock';

describe('cartService', () => {
  let cartsRepository: CartsRepository;
  let itemsRepository: ItemsRepository;
  let cartService: CartService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: CartsRepository, useFactory: mockCartRepository },
        { provide: ItemsRepository, useFactory: mockItemsRepository },
      ],
    }).compile();
    cartsRepository = module.get(CartsRepository);
    itemsRepository = module.get(ItemsRepository);
    cartService = module.get(CartService);
  });

  test('get client cart', async () => {
    const findOneSpy = jest
      .spyOn(cartsRepository, 'findOne')
      .mockResolvedValueOnce(userWithClientStub.userable['cart']);

    const expected = await cartService.getClientCart(userWithClientStub);

    expect(expected).toEqual(userWithClientStub.userable['cart']);
    expect(findOneSpy).toBeCalledWith({
      where: { id: userWithClientStub.userable['cart'].id },
    });
  });
  test('add to cart', async () => {
    const findOneItemSpy = jest
      .spyOn(itemsRepository, 'findOne')
      .mockResolvedValueOnce(itemStub);
    const findOneCartSpy = jest
      .spyOn(cartsRepository, 'findOneBy')
      .mockResolvedValueOnce(cartStub);
    const saveCartSpy = jest
      .spyOn(cartsRepository, 'save')
      .mockResolvedValueOnce({ ...cartStub, items: [itemStub] });

    const expected = await cartService.addToCart(
      { item: 'itemId' },
      userWithClientStub,
    );

    expect(expected.menuId).toEqual(itemStub.menu.id);
    expect(expected.items).toContain(itemStub);
    expect(findOneItemSpy).toBeCalledWith({
      where: { id: itemStub.id },
      relations: { menu: true },
    });
    expect(findOneCartSpy).toBeCalledWith({
      id: userWithClientStub.userable['cart'].id,
    });
    expect(saveCartSpy).toBeCalled();
  });

  test('removce from cart', async () => {
    const checker = cartStub.items.length === 1;
    const findOneCartSpy = jest
      .spyOn(cartsRepository, 'findOneBy')
      .mockResolvedValueOnce(cartStub);
    const clearCartSpy = jest
      .spyOn(cartService, 'clear')
      .mockResolvedValue(cartStub);

    const saveCartSpy = jest
      .spyOn(cartsRepository, 'save')
      .mockResolvedValueOnce(cartStub);

    const expected = await cartService.removeFromCart(
      { item: itemOnCartStub.id },
      userWithClientStub,
    );
    expect(expected.items).not.toContain(itemOnCartStub);
    expect(findOneCartSpy).toBeCalledWith({ id: cartStub.id });
    if (checker) {
      expect(clearCartSpy).toBeCalled();
    } else {
      expect(saveCartSpy).toBeCalled();
    }

    clearCartSpy.mockRestore();
  });

  test('create cart', async () => {
    const createCartSpy = jest
      .spyOn(cartsRepository, 'create')
      .mockReturnValue(new Cart());
    const saveCartSpy = jest
      .spyOn(cartsRepository, 'save')
      .mockResolvedValueOnce(new Cart());

    const expected = await cartService.create();

    expect(expected).toEqual(new Cart());
    expect(createCartSpy).toBeCalled();
    expect(saveCartSpy).toBeCalled();
  });
  test('clear cart', async () => {
    const createCartSpy = jest
      .spyOn(cartsRepository, 'findOneBy')
      .mockResolvedValue(cartStub);
    const saveCartSpy = jest
      .spyOn(cartsRepository, 'save')
      .mockResolvedValueOnce({ id: 'cartId', items: [], menuId: null } as Cart);

    const expected = await cartService.clear(clientStub);
    expect(expected.items).toHaveLength(0);
    expect(expected.menuId).toBe(null);

    expect(createCartSpy).toBeCalledWith({ id: cartStub.id });
    expect(saveCartSpy).toBeCalled();
  });
});

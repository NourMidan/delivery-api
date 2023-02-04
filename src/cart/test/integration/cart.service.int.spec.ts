import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { CartsRepository } from 'src/cart/carts.respository';
import { CartService } from 'src/cart/cart.service';
import { createCLientStub } from 'src/test/stubs';
import { AuthService } from 'src/auth/auth.service';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import * as supertest from 'supertest';
import { Client } from 'src/clients/entities/client.entity';
import { Item } from 'src/item/entities/item.entity';

describe('cart Service int', () => {
  let app: INestApplication;
  let cartRepository: CartsRepository;
  let cartService: CartService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    cartService = module.get(CartService);
    authService = module.get(AuthService);
    cartRepository = module.get(CartsRepository);
  });

  it('should be defined', () => {
    expect(cartRepository).toBeDefined();
    expect(cartService).toBeDefined();
  });
  let user: UserWithUserable;
  let items: Item[];
  test('login client ', async () => {
    const { body: userData } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({ username: createCLientStub.email, ...createCLientStub })
      .expect(201);
    user = userData;
    items = userData.userable['cart'].items;
  });
  test('get client cart ', async () => {
    const expected = await cartService.getClientCart(user);

    expect(expected.id).toEqual(user.userable['cart'].id);
  });
  test('remove from cart ', async () => {
    const expected = await cartService.removeFromCart(
      {
        item: items[0].id,
      },
      user,
    );

    expect(expected.items).not.toContainEqual(items[0]);
    expect(expected.items).toContainEqual(items[1]);
  });
  test('clear  cart ', async () => {
    const expected = await cartService.clear(user.userable as Client);

    expect(expected.items).toHaveLength(0);
    expect(expected.menuId).toBe(null);
  });

  test('add to  cart ', async () => {
    const expected = await cartService.addToCart(
      {
        item: items[0].id,
      },
      user,
    );
    const { menu, ...item } = expected.items[0];
    expect(item).toEqual(items[0]);
  });

  afterAll(async () => {
    await app.close();
  });
});

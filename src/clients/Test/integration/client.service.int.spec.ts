import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { ClientsService } from 'src/clients/clients.service';
import { ClientsRepository } from 'src/clients/clients.respository';
import { CreateClientDto } from 'src/auth/dto/create-client.dto';
import { UsersRepository } from 'src/users/users.respository';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { CartsRepository } from 'src/cart/carts.respository';

describe('Client Service int', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let clientsService: ClientsService;
  let clientRepository: ClientsRepository;
  let cartRepository: CartsRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersRepository = module.get(UsersRepository);
    clientsService = module.get(ClientsService);
    clientRepository = module.get(ClientsRepository);
    cartRepository = module.get(CartsRepository);
  });

  const createClientDto: CreateClientDto = {
    email: 'user2@email.com',
    password: '12345678',
  };

  let client: UserWithUserable;

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(clientsService).toBeDefined();
    expect(clientRepository).toBeDefined();
    expect(cartRepository).toBeDefined();
  });
  describe('should create client', () => {
    it('should create client', async () => {
      client = await clientsService.signUp(createClientDto, 'client');
      expect(client.email).toBe(createClientDto.email);
      expect(client.targetType).toBe('client');
    });
    it('should get client by id', async () => {
      const clientData = await clientsService.findOneById(client.userable.id);

      expect(clientData.id).toEqual(client.userable.id);
    });
  });

  afterAll(async () => {
    await usersRepository.delete(client.id);
    await clientRepository.delete(client.userable.id);
    await cartRepository.delete(client.userable['cart'].id);
    await app.close();
  });
});

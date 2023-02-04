import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.respository';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
describe('users Service int', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  const createUserDto: CreateUserDto = {
    email: 'user3@email.com',
    password: '12345678',
  };
  let createdUser: User;

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('user creation', () => {
    test('should create user', async () => {
      const expected = await usersService.create(
        createUserDto,
        'userableId',
        'client',
      );

      const user = {
        email: createUserDto.email,
        targetType: 'client',
        targetId: expect.any(String),
        id: expect.any(String),
      };

      expect(expected).toEqual(user);

      createdUser = expected;
    });
    test('should throw on duplicate email', async () => {
      await usersService
        .create(createUserDto, 'userableId3', 'client')
        .then((user) => expect(user).toBeUndefined())
        .catch((error) => expect(error.code).toBe('ER_DUP_ENTRY'));
    });
  });

  test('should find user by email', async () => {
    const expected = await usersService.findOneByEmail(createdUser.email);

    expect(expected).toEqual({ ...createdUser, password: expect.any(String) });
  });
  test('should return null if not found by email', async () => {
    const expected = await usersService.findOneByEmail('wrong@email.com');
    expect(expected).toBe(null);
  });
  test('should find user by id', async () => {
    const expected = await usersService.findOneById(createdUser.id);
    expect(expected).toEqual({ ...createdUser, password: expect.any(String) });
  });
  test('should return null if not found by id', async () => {
    const expected = await usersService.findOneById('wrongId');
    expect(expected).toBe(null);
  });

  afterAll(async () => {
    await usersRepository.delete(createdUser.id);
    await app.close();
  });
});

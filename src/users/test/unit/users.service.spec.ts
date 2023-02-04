import { Test } from '@nestjs/testing';
import { UsersRepository } from '../../users.respository';
import { UsersService } from '../../users.service';
import * as bcrypt from 'bcrypt';
import { mockUsersRepository } from './__mocks__/users.mock';
import {
  data,
  mockUserWithoutEmail,
  mockUserWithoutId,
  user,
} from './stubs/users.stub';
import { User } from 'src/users/entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  // global spy
  // let repoSpy: jest.SpyInstance
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  it('find user by email', async () => {
    const repoSpy = jest
      .spyOn(usersRepository, 'findOneBy')
      .mockImplementation(async (options) => {
        return {
          email: options['email'],
          ...mockUserWithoutEmail,
        };
      });

    const expected = await usersService.findOneByEmail('user@email');

    expect(expected).toEqual({
      email: 'user@email',
      ...mockUserWithoutEmail,
    });
    expect(repoSpy).toBeCalledWith({ email: 'user@email' });

    // restore the original implementation
    repoSpy.mockRestore();
  });

  it('find user by Id', async () => {
    const repoSpy = jest
      .spyOn(usersRepository, 'findOneBy')
      .mockImplementation(async (options) => {
        return {
          id: options['id'],
          ...mockUserWithoutId,
        };
      });

    const expected = await usersService.findOneById('1234');

    expect(expected).toEqual({
      id: '1234',
      ...mockUserWithoutId,
    });
    expect(repoSpy).toBeCalledWith({ id: '1234' });

    // restore the original implementation
    repoSpy.mockRestore();
  });

  describe('create', () => {
    test('creates new user', async () => {
      const genSaltSpy = jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(() => 'salt');

      const hashSpy = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation((options) => 'hashedPassword');

      const createUserSpy = jest
        .spyOn(usersRepository, 'create')
        .mockImplementation((options) => options as User);

      const userwithpassword = { password: 'hashedPassword', ...user };
      const saveUserSpy = jest
        .spyOn(usersRepository, 'save')
        .mockImplementation(async () => userwithpassword);

      const expected = await usersService.create(data, 'clientId', 'client');

      expect(expected).toEqual(user);
      expect(genSaltSpy).toBeCalled();
      expect(hashSpy).toBeCalledWith(data.password, 'salt');
      expect(createUserSpy).toBeCalledWith({
        email: 'user@email',
        password: 'hashedPassword',
        targetId: 'clientId',
        targetType: 'client',
      });
      expect(saveUserSpy).toBeCalledWith({
        email: 'user@email',
        password: 'hashedPassword',
        targetId: 'clientId',
        targetType: 'client',
      });
    });
  });
});

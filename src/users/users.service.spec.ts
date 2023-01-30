import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.respository';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { Client } from 'src/clients/entities/client.entity';
const mockUserWithoutEmail = {
  id: '1234',
  password: '1234',
  targetId: '1234',
  targetType: 'client',
};

const mockUserWithoutId = {
  email: 'user@email',
  password: '**',
  targetId: '1234',
  targetType: 'client',
};
const mockUserWithoutPassword = {
  email: 'user@email',
  targetType: 'client',
};
const mockCart = {
  id: '1234',
  items: [],
  menuId: null,
  client: {},
};

const data =  { email: 'user@email', password: '123456789' }

const user ={
  email: 'user@email',
  id: expect.any(String),
  targetId: expect.any(String),
  targetType: 'client',
}
const mockUsersRepository = () => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save : jest.fn()
});




describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository;


  // global spy
  // let repoSpy: jest.SpyInstance
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
      ],
    }).compile();
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  describe('findOneByEmail', () => {
    it('find user by email', async () => {
      const repoSpy = jest
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue({ email: 'user@email', ...mockUserWithoutEmail });
      expect(usersService.findOneByEmail('user@email')).resolves.toEqual({
        email: 'user@email',
        ...mockUserWithoutEmail,
      });
      expect(repoSpy).toBeCalledWith({ email: 'user@email' });

      // restore the original implementation
      repoSpy.mockRestore();
    });
  });

  describe('findOneById', () => {
    it('find user by Id', async () => {
      const repoSpy = jest
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue({ id: '1234', ...mockUserWithoutId });
      expect(usersService.findOneById('1234')).resolves.toEqual({
        id: '1234',
        ...mockUserWithoutId,
      });
      expect(repoSpy).toBeCalledWith({ id: '1234' });

      // restore the original implementation
      //   repoSpy.mockRestore()
    });
  });

  describe('create', () => {
    it('creates new user', async () => {
      const genSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => null);
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => '**');
      const createUserSpy = jest.spyOn(usersRepository, 'create').mockResolvedValue({
        targetId: expect.any(String),
        id: expect.any(String),
        password: hashSpy,
        ...mockUserWithoutPassword,
      });

      const userwithpassword ={password:"**",...user}
      const saveUserSpy = jest.spyOn(usersRepository, 'save').mockImplementation(() =>userwithpassword);
      const expected = await usersService.create(
         data,
          '12334',
          'client',
      );

      
      expect(expected).toEqual(user)


      expect(genSaltSpy).toBeCalled()
      expect(hashSpy).toBeCalled()
      expect(createUserSpy).toBeCalled()
      expect(saveUserSpy).toBeCalled()



     
    });
  });
});

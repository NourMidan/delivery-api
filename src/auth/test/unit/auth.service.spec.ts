import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { ClientsService } from 'src/clients/clients.service';
import { OwnersService } from 'src/owners/owners.service';
import { UsersService } from 'src/users/users.service';
import {
  clientStub,
  loginUserStub,
  ownerStub,
  userWithClientStub,
  userWithoutEmailStub,
  userWithOwnerStub,
} from './stubs/auth.stub';
import {
  mockClientService,
  mockOwnerService,
  mockUserService,
} from './__mocks__/auth.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let clientsService: ClientsService;
  let ownerService: OwnersService;
  let usersService: UsersService;
  let authService: AuthService;
  let jwt: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: 7776000,
          },
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUserService },
        { provide: ClientsService, useFactory: mockClientService },
        { provide: OwnersService, useFactory: mockOwnerService },
      ],
    }).compile();

    jwt = module.get(JwtService);
    clientsService = module.get(ClientsService);
    ownerService = module.get(OwnersService);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);
  });

  test('shoud be defined', () => {
    expect(clientsService).toBeDefined();
    expect(ownerService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwt).toBeDefined();
  });

  test('should  validate User Credentials', async () => {
    const findByEmailSpy = jest
      .spyOn(usersService, 'findOneByEmail')
      .mockImplementation(async (email) => {
        return {
          email,
          ...userWithoutEmailStub,
          password: loginUserStub.password,
        };
      });

    const compareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => true);
    const expected = await authService.validateUserCredentials(loginUserStub);

    expect(expected).toEqual({
      email: loginUserStub.username,
      ...userWithoutEmailStub,
    });
    expect(findByEmailSpy).toBeCalledWith(loginUserStub.username);
    expect(compareSpy).toBeCalled();
  });

  test('should  login client', async () => {
    const findClientSpy = jest
      .spyOn(clientsService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...clientStub,
        };
      });

    const expected = await authService.signIn(userWithClientStub);

    const matchObject = {
      ...userWithClientStub,
      userable: clientStub,
      token: expect.any(String),
    };

    expect(expected).toMatchObject(matchObject);
    expect(findClientSpy).toBeCalledWith(userWithClientStub.targetId);
  });

  test('should  login  owner', async () => {
    const findOwnerSpy = jest
      .spyOn(ownerService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...ownerStub,
        };
      });

    const expected = await authService.signIn(userWithOwnerStub);
    const matchObject = {
      ...userWithOwnerStub,
      userable: ownerStub,
      token: expect.any(String),
    };

    expect(expected).toMatchObject(matchObject);
    expect(findOwnerSpy).toBeCalledWith(userWithOwnerStub.targetId);
  });

  test('should  validate owner by Id', async () => {
    const findUserSpy = jest
      .spyOn(usersService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...userWithOwnerStub,
        };
      });

    // should be called with ownerId
    const findOwnerSpy = jest
      .spyOn(ownerService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...ownerStub,
        };
      });

    const expected = await authService.validateUser(userWithOwnerStub.id);
    const matchObject = {
      ...userWithOwnerStub,
      userable: ownerStub,
    };

    expect(findUserSpy).toBeCalledWith(userWithOwnerStub.id);
    expect(findOwnerSpy).toBeCalledWith(userWithOwnerStub.targetId);
    expect(expected).toMatchObject(matchObject);
  });
  test('should  validate client by Id', async () => {
    const findUserSpy = jest
      .spyOn(usersService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...userWithClientStub,
        };
      });

    // should be called with clientId
    const findClientSpy = jest
      .spyOn(clientsService, 'findOneById')
      .mockImplementation(async (id) => {
        return {
          id,
          ...clientStub,
        };
      });

    const expected = await authService.validateUser(userWithClientStub.id);
    const matchObject = {
      ...userWithClientStub,
      userable: clientStub,
    };

    expect(findUserSpy).toBeCalledWith(userWithClientStub.id);
    expect(findClientSpy).toBeCalledWith(userWithClientStub.targetId);
    expect(expected).toMatchObject(matchObject);
  });
});

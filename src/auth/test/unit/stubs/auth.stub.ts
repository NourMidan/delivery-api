import { UserWithUserable } from 'src/auth/auth-interfaces';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { Client } from 'src/clients/entities/client.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { User } from 'src/users/entities/user.entity';

export const loginUserStub: LoginUserDto = {
  username: 'user@gmail.com',
  password: '12345678',
};

export const userWithoutEmailStub = {
  id: expect.any(String),
  targetId: expect.any(String),
  targetType: expect.any(String),
};

export const clientStub = new Client();
clientStub.id = 'clientId';

export const ownerStub = new Owner();
ownerStub.id = 'ownerId';

export const userWithClientStub = new UserWithUserable();
userWithClientStub.id = 'userClientId';
userWithClientStub.targetType = 'client';
userWithClientStub.targetId = 'clientId';

export const userWithOwnerStub = new UserWithUserable();
userWithOwnerStub.id = 'userOwnerId';
userWithOwnerStub.targetType = 'owner';
userWithOwnerStub.targetId = 'ownerId';

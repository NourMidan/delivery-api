export const mockOwnerRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

export const mockMenuRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

export const mockUserService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

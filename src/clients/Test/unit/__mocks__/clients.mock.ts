export const mockClientRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

export const mockCartRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

export const mockUserService = {
  findOneByEmail: jest.fn(),
  create: jest.fn(),
};

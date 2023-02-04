export const mockUserService = () => ({
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
});
export const mockClientService = () => ({
  findOne: jest.fn(),
  findOneById: jest.fn(),
});
export const mockOwnerService = () => ({
  findOne: jest.fn(),
  findOneById: jest.fn(),
});

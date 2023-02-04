export const mockCartRepository = () => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
export const mockItemsRepository = () => ({
  findOne: jest.fn(),
});

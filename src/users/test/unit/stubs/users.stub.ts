export const mockUserWithoutEmail = {
  id: 'userId',
  password: 'userPassword',
  targetId: 'userId',
  targetType: 'client',
};

export const mockUserWithoutId = {
  email: 'user@email',
  password: '**',
  targetId: '1234',
  targetType: 'client',
};

export const data = { email: 'user@email', password: '123456789' };

export const user = {
  email: 'user@email',
  id: expect.any(String),
  targetId: expect.any(String),
  targetType: 'client',
};

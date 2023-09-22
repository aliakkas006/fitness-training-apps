import userService from '../../../src/lib/user';
import User from '../../../src/model/User';
import { badRequest } from '../../../src/utils/error';

jest.mock('../../../src/model/User', () => ({
  create: jest.fn(),
}));

describe('Create account service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new account', async () => {
    // Mock input data for the createAccount function
    const input = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock a user document
    const mockUser = {
      id: 'user123',
      ...input,
    };

    (User.create as jest.Mock).mockResolvedValue(mockUser);

    // Call the createAccount function with the input data
    const result = await userService.createAccount(input);

    // Assertions
    expect(User.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: input.password,
    });
    expect(result).toEqual({ ...mockUser, id: mockUser.id });
  });

  it('should throw an error for missing parameters', async () => {
    // Mock input data with missing parameters
    const input: any = {
      name: 'Test User',
    };

    // Expect the createAccount function to throw an error
    await expect(userService.createAccount(input)).rejects.toThrowError(
      badRequest('Invalid Parameters!')
    );

    // Ensure that User.create is not called
    expect(User.create).not.toHaveBeenCalled();
  });
});

import userService from '../../../src/lib/user';
import User from '../../../src/model/User';

// Mock the User model
jest.mock('../../../src/model/User');

describe('createAccount service', () => {
  it('should create a new user account and return the created user', async () => {
    // Mock input data for the createAccount function
    const input = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    // Mock a user document
    const mockUser = {
      _id: 'user123',
      ...input,
    };

    // Mock the User model's save method
    const mockSave = jest.fn();
    User.prototype.save = mockSave;
    mockSave.mockResolvedValue(mockUser);

    // Call the createAccount function with the input data
    const result = await userService.createAccount(input);

    // Assertions
    expect(result).toEqual({
      id: 'user123',
      ...input,
    });

    // Verify that the save method was called with the correct data
    expect(mockSave).toHaveBeenCalledWith();
  });

  it('should throw a badRequest error if invalid parameters are provided', async () => {
    // Mock input data with missing parameters
    const input = {
      name: 'Test User',
      email: '',
      password: '',
    };

    // Call the createAccount function with invalid input
    try {
      await userService.createAccount(input);
      // If the function does not throw an error, fail the test
      fail('Expected createAccount to throw an error');
    } catch (error: any) {
      // Verify that the error is a badRequest error
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid Parameters!');
    }
  });
});

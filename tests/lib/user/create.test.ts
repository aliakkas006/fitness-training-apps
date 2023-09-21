import userService from '../../../src/lib/user';
import User from '../../../src/model/User';
import { generateHash } from '../../../src/utils/hashing';
import { badRequest } from '../../../src/utils/error';
import { Role, UStatus } from '../../../src/types/enums';

// Mock the User model
jest.mock('../../../src/model/User');
jest.mock('../../../src/utils/hashing');
jest.mock('../../../src/utils/error');

describe('create user service', () => {
  it('should create a new user', async () => {
    // Mock input data for the create function
    const input = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: Role.USER,
      status: UStatus.APPROVED,
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

    // Mock the password hashing function
    // const mockGenerateHash = jest.fn();
    (generateHash as jest.Mock).mockReturnValue('hashedPassword');

    // Call the create function with the input data
    const result = await userService.create(input);

    // Assertions
    expect(result).toEqual({
      _id: 'user123',
      ...input,
      password: 'hashedPassword',
      role: Role.USER, // Default role
      status: UStatus.PENDING, // Default status
    });

    // Verify that the save method was called with the correct data
    expect(mockSave).toHaveBeenCalledWith();
  });

  it('should throw a bad request error for invalid parameters', async () => {
    // Mock input data with missing parameters
    const input: any = {
      name: 'Test User',
      email: 'test@example.com',
    };

    // Call the create function with missing parameters
    await expect(userService.create(input)).rejects.toThrowError(badRequest('Inavalid parameters'));
  });
});

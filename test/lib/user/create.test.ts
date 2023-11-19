import userService from '../../../src/lib/user';
import { generateHash } from '../../../src/utils/hashing';
import { Role, UStatus } from '../../../src/types/enums';

jest.mock('../../../src/lib/user', () => ({
  create: jest.fn(),
}));

jest.mock('../../../src/utils/hashing', () => ({
  generateHash: jest.fn(),
}));

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
      id: 'user123',
      ...input,
    };

    (userService.create as jest.Mock).mockResolvedValue(mockUser);
    (generateHash as jest.Mock).mockResolvedValue('hashedPassword');

    // Call the create function with the input data
    const result = await userService.create(input);

    // Assertions
    expect(userService.create).toHaveBeenCalledWith({
      name: input.name,
      email: input.email,
      password: input.password,
      role: input.role,
      status: input.status,
    });
    expect(result).toEqual(mockUser);
  });
});

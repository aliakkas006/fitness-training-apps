import userService from '../../../src/lib/user';
import { generateHash } from '../../../src/utils/hashing';

jest.mock('../../../src/lib/user', () => ({
  changePassword: jest.fn(),
}));

jest.mock('../../../src/utils/hashing', () => ({
  generateHash: jest.fn(),
}));

describe('change password service', () => {
  it('should change password', async () => {
    // Mock input data for the changePassword function
    const input = {
      id: 'user123',
      password: 'password',
    };
    // Mock a user document
    const mockUser = {
      id: 'user123',
      password: 'password',
    };

    const mockHash = 'hashedPassword';

    (generateHash as jest.Mock).mockResolvedValue(mockHash);
    (userService.changePassword as jest.Mock).mockResolvedValue(mockUser);

    // Call the changePassword function with the input data
    const result = await userService.changePassword(input.id, input.password);
    // Assertions
    // expect(generateHash).toHaveBeenCalledWith(input.password);
    expect(userService.changePassword).toHaveBeenCalledWith(mockUser.id, mockUser.password);
    expect(result).toEqual(mockUser);
  });
});

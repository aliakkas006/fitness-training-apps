import userService from '../../../src/lib/user';
import { Role } from '../../../src/types/enums';
import { UStatus } from '../../../src/types/enums';

jest.mock('../../../src/lib/user', () => ({
  updateProperties: jest.fn(),
}));

describe('update user service', () => {
  it('should update a user', async () => {
    // Mock input data for the update function
    const input = {
      name: 'Test User',
      email: 'ali@gmail.com',
      role: Role.USER,
      status: UStatus.APPROVED,
    };
    // Mock a user document
    const mockUser = {
      id: 'user123',
      ...input,
    };
    (userService.updateProperties as jest.Mock).mockResolvedValue(mockUser);
    // Call the update function with the input data
    const result = await userService.updateProperties(mockUser.id, input);
    // Assertions
    expect(userService.updateProperties).toHaveBeenCalledWith(mockUser.id, {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
    });
    expect(result).toEqual(mockUser);
  });
});

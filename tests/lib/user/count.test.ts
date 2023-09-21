import userService from '../../../src/lib/user';
import User from '../../../src/model/User';

// Mock the User model
jest.mock('../../../src/model/User');

describe('count service', () => {
  it('should count users based on provided filters', async () => {
    // Mock input filters
    const filters = {
      name: 'Test',
      email: 'test@example.com',
    };

    // Mock the User model's count method
    const mockCount = jest.fn();
    User.count = mockCount;
    mockCount.mockResolvedValue(5);

    // Call the count function with the input filters
    const result = await userService.count(filters);

    // Assertions
    expect(result).toBe(5);

    // Verify that the count method was called with the correct filters
    expect(User.count).toHaveBeenCalledWith({
      name: { $regex: 'Test', $options: 'i' },
      email: { $regex: 'test@example.com', $options: 'i' },
    });
  });
});

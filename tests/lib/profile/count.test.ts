import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';

// Mock the Profile model
jest.mock('../../../src/model/Profile');

describe('count service', () => {
  it('should count profiles based on provided filters', async () => {
    // Mock input data for the count function
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    // Mock the Profile model's count method
    const mockCount = jest.fn();
    Profile.count = mockCount;
    mockCount.mockResolvedValue(5);

    // Call the count function with the input data
    const result = await profileService.count(input);

    // Assertions
    expect(result).toBe(5);

    // Verify that the count method was called with the correct filter
    expect(Profile.count).toHaveBeenCalledWith({
      $or: [
        { firstName: { $regex: input.firstName, $options: 'i' } },
        { lastName: { $regex: input.lastName, $options: 'i' } },
        { email: { $regex: input.email, $options: 'i' } },
      ],
    });
  });
});

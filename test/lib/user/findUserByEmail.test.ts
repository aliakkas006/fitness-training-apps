import userService from '../../../src/lib/user';
import User from '../../../src/model/User';

// Mock the User model
jest.mock('../../../src/model/User');

describe('findUserByEmail service', () => {
  it('should find a user by email and return the user', async () => {
    // Mock input data for the findUserByEmail function
    const userEmail = 'user@example.com';

    // Mock a user document
    const mockUser = {
      _id: 'user123',
      name: 'Test user',
      email: userEmail,
      role: 'user',
      status: 'approved',
    };

    // Mock the findOne method of User
    User.findOne = jest.fn().mockResolvedValue(mockUser);

    // Call the findUserByEmail function with the userEmail
    const result = await userService.findUserByEmail(userEmail);

    // Assertions
    expect(result).toEqual(mockUser);

    // Verify that User.findOne was called with the email
    expect(User.findOne).toHaveBeenCalledWith({ email: userEmail });
  });

  it('should return false if no user is found with the provided email', async () => {
    // Mock input data for the findUserByEmail function with a non-existent email
    const userEmail = 'nonexistent@example.com';

    // Mock that User.findOne returns null to simulate no user found
    User.findOne = jest.fn().mockResolvedValue(null);

    // Call the findUserByEmail function with the non-existent email
    const result = await userService.findUserByEmail(userEmail);

    // Assertion
    expect(result).toBe(false);

    // Verify that User.findOne was called with the email
    expect(User.findOne).toHaveBeenCalledWith({ email: userEmail });
  });
});

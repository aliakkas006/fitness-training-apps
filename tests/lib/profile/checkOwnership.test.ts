import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';

// Mock the Profile model and its methods
jest.mock('../../../src/model/Profile', () => ({
  findById: jest.fn(),
}));

describe('checkOwnership function', () => {
  it('should return true when the user owns the profile', async () => {
    const mockProfile = {
      user: {
        _id: 'user123',
      },
    };

    (Profile.findById as jest.Mock).mockResolvedValue(mockProfile);

    const resourceId = 'validProfileId';
    const userId = 'user123';

    const result = await profileService.checkOwnership({ resourceId, userId });

    // Expect the result to be true since the user owns the profile
    expect(result).toBe(true);
  });

  it('should return false when the user does not own the profile', async () => {
    const mockProfile = {
      user: {
        _id: 'user456',
      },
    };

    // Mock the Profile.findById method to return the mockProfile
    (Profile.findById as jest.Mock).mockResolvedValue(mockProfile);

    const resourceId = 'validProfileId';
    const userId = 'user123';

    const result = await profileService.checkOwnership({ resourceId, userId });

    // Expect the result to be false since the user does not own the profile
    expect(result).toBe(false);
  });

  it('should throw an error if no profile is found with the provided resourceId', async () => {
    // Mock the Profile.findById method to return null (indicating no profile found)
    (Profile.findById as jest.Mock).mockResolvedValue(null);

    const resourceId = 'nonExistentProfileId';
    const userId = 'user123';

    // Ensure that an error is thrown when no profile is found
    await expect(profileService.checkOwnership({ resourceId, userId })).rejects.toThrow(
      'Resource Not Found'
    );
  });
});

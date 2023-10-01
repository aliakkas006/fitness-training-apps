import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';
import User from '../../../src/model/User';

// Mock the Profile and User models and their methods
jest.mock('../../../src/model/Profile', () => ({
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock('../../../src/model/User', () => ({
  findOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

describe('removeItem function', () => {
  it('should remove a profile and its associated user when a valid ID is provided', async () => {
    const mockProfile = {
      _doc: {
        firstName: 'Ali',
        lastName: 'Akkas',
        email: 'akkas@example.com',
        age: 30,
        height: 175,
        weight: 70,
        fitnessLevel: 'Intermediate',
        goal: 'Build muscle',
        user: 'user123',
      },
      id: "profile123",
    };

    (Profile.findById as jest.Mock).mockResolvedValue(mockProfile);

    const mockUser: any = {
      id: 'user123',
      name: 'Ali Akkas',
      email: 'akkas@example.com',
      role: 'user',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    // Mock the Profile.findByIdAndDelete and User.findByIdAndDelete methods
    (Profile.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProfile);
    (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

    const id = 'validProfileId';

    const result = await profileService.removeItem(id);

    // Ensure that the Profile and User findByIdAndDelete methods were called
    expect(Profile.findByIdAndDelete).toHaveBeenCalledWith(id);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);

    // expect(result)
    expect(result).toEqual({ ...mockProfile, id: mockProfile.id });
  });

  it('should throw an error if no profile is found with the provided ID', async () => {
    // Mock the Profile.findById method to return null (indicating no profile found)
    (Profile.findById as jest.Mock).mockResolvedValue(null);

    const id = 'nonExistentProfileId';

    await expect(profileService.removeItem(id)).rejects.toThrow('Resource Not Found');
  });
});

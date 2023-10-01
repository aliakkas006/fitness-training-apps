import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';

// Mock the Profile model and its methods
jest.mock('../../../src/model/Profile', () => ({
  findById: jest.fn(),
}));

describe('findSingleItem function', () => {
  it('should find and return a profile when a valid ID is provided', async () => {
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
      id: 'profile123',
    };

    (Profile.findById as jest.Mock).mockResolvedValue(mockProfile);

    const id = 'validProfileId';

    const result = await profileService.findSingleItem(id);

    expect(result).toEqual({ ...mockProfile._doc, id: mockProfile.id });
  });

  it('should throw an error if no profile is found with the provided ID', async () => {
    // Mock the Profile.findById method to return null (indicating no profile found)
    (Profile.findById as jest.Mock).mockResolvedValue(null);

    const id = 'nonExistentProfileId';

    await expect(profileService.findSingleItem(id)).rejects.toThrow('Resource Not Found');
  });

  it('should throw an error if an invalid ID is provided', async () => {
    const id = '';
    await expect(profileService.findSingleItem(id)).rejects.toThrow('Id is required!');
  });
});

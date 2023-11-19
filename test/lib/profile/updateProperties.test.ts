import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';

// Mock the Profile model and its methods
jest.mock('../../../src/model/Profile', () => ({
  findById: jest.fn(),
  save: jest.fn(),
}));

describe('updateProperties function', () => {
  it('should update profile properties when a valid ID and payload are provided', async () => {
    const mockProfile = {
      _doc: {
        firstName: 'Ali',
        lastName: 'Akkas',
        email: 'akkas@example.com',
        profilePic: 'my-profile.jpg',
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
    const updatePayload: any = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@example.com',
      profilePic: 'my-profile.jpg',
      age: 30,
      height: 175,
      weight: 70,
      fitnessLevel: 'intermediate',
      goal: 'build_muscle',
    };

    const result = await profileService.updateProperties(id, updatePayload);

    // Assertion
    expect(result).toEqual({ ...mockProfile, id: mockProfile.id });
  });

  it('should throw an error if no profile is found with the provided ID', async () => {
    // Mock the Profile.findById method to return null (indicating no profile found)
    (Profile.findById as jest.Mock).mockResolvedValue(null);

    const id = 'nonExistentProfileId';
    const updatePayload: any = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@example.com',
      profilePic: 'my-profile.jpg',
      age: 30,
      height: 175,
      weight: 70,
      fitnessLevel: 'intermediate',
      goal: 'build_muscle',
    };

    // Ensure that an error is thrown when no profile is found
    await expect(profileService.updateProperties(id, updatePayload)).rejects.toThrow(
      'Resource Not Found'
    );
  });
});

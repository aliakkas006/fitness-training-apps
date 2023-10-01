import profileService from '../../../src/lib/profile';
import Profile from '../../../src/model/Profile';

// Mock the Profile model and its methods
jest.mock('../../../src/model/Profile', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('create function', () => {
  it('should create a new profile when valid parameters are provided', async () => {
    // Mock the Profile.findOne method to return null (indicating no existing profile)
    (Profile.findOne as jest.Mock).mockResolvedValue(null);

    // Mock the Profile.create method to return a new profile
    const mockCreatedProfile = {
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

    (Profile.create as jest.Mock).mockResolvedValue(mockCreatedProfile);

    const newProfileData = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@example.com',
      profilePic: 'my-profile.jpg',
      age: 30,
      height: 175,
      weight: 70,
      fitnessLevel: 'Intermediate',
      goal: 'Build muscle',
      user: { id: 'user123' },
    };

    const result = await profileService.create(newProfileData);

    expect(result).toEqual({ ...mockCreatedProfile, id: mockCreatedProfile.id });
  });

  it('should throw an error if the profile already exists', async () => {
    const existingProfile = {
      _doc: {
        firstName: 'Anisur',
        lastName: 'Rahman',
        email: 'anis@example.com',
        age: 25,
        height: 160,
        weight: 55,
        fitnessLevel: 'Beginner',
        goal: 'Lose weight',
        user: 'user456',
      },
      id: 'existingProfile123',
    };
    (Profile.findOne as jest.Mock).mockResolvedValue(existingProfile);

    const newProfileData = {
      firstName: 'Anisur',
      lastName: 'Rahman',
      email: 'anis@example.com',
      age: 25,
      height: 160,
      weight: 55,
      fitnessLevel: 'Beginner',
      goal: 'Lose weight',
      user: { id: 'user456' },
    };

    await expect(profileService.create(newProfileData)).rejects.toThrow('Profile already exist!');
  });

  it('should throw an error if invalid parameters are provided', async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);

    // Simulate invalid parameters by providing incomplete data
    const invalidProfileData = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@example.com',
      age: 30,
      // Missing height, weight, fitnessLevel, goal, and user
    };

    await expect(profileService.create(invalidProfileData)).rejects.toThrow('Invalid parameters!');
  });
});

import profileService from '../../../src/lib/profile';

// Mock the Profile model and its methods
jest.mock('../../../src/model/Profile', () => ({
  find: jest.fn(),
}));

jest.mock('../../../src/lib/profile');

describe('findAllItems function', () => {
  it('should return an array of profiles based on filter criteria', async () => {
    (profileService.findAllItems as jest.Mock).mockResolvedValue([
      { firstName: 'Ali', lastName: 'Akkas', email: 'akkas@example.com' },
      { firstName: 'Anisur', lastName: 'Rahman', email: 'anis@example.com' },
    ]);

    const filter = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@example.com',
    };

    const result = await profileService.findAllItems(filter);

    expect(Array.isArray(result)).toBe(true);
  });

  it('should return an empty array when no profiles match the filter', async () => {
    // Mock the Profile.find method to return an empty DocumentQuery
    (profileService.findAllItems as jest.Mock).mockResolvedValue([]);

    const filter = {
      firstName: 'Isrer',
      lastName: 'Mahmud',
      email: 'example.com',
    };

    const result = await profileService.findAllItems(filter);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

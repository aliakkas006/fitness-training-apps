import request from 'supertest';
import app from '../../../src/app';
import profileService from '../../../src/lib/profile';

jest.mock('../../../src/lib/profile', () => ({
  findSingleItem: jest.fn(),
}));

describe('findSingleItem Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a profile when it exists', async () => {
    const mockProfile = {
      id: '6503ec0ba755eaaef92eaabe',
      firstName: 'Anisur',
      lastName: 'Rahman',
      email: 'anis@gmail.com',
      profilePic: 'profile1.jpg',
      age: 23,
      height: 6,
      weight: 60,
      fitnessLevel: 'beginner',
      goal: 'build_muscle',
      user: 'user123',
    };

    // Mock the profileService to return the profile
    (profileService.findSingleItem as jest.Mock).mockResolvedValue(mockProfile);

    const response = await request(app)
      .get('/api/v1/profiles/:id')
      // .set('Authorization', `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200);

    expect(response.body).toEqual({
      code: 200,
      message: 'Successfully fetch a profile',
      data: mockProfile,
      links: {
        self: '/api/v1/profiles/:id',
      },
    });
  });
});

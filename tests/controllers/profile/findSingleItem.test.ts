import express from 'express';
import request from 'supertest';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findSingleItem from '../../../src/api/v1/profile/controllers/findSingleItem';
import profileService from '../../../src/lib/profile';

jest.mock('../../../src/lib/profile', () => ({
  findSingleItem: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.get('/api/v1/profiles/:id', findSingleItem);

describe('Find Single Item Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
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

    const response = await request(app).get('/api/v1/profiles/:id').expect(200);

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

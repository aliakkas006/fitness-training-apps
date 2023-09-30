import express from 'express';
import request from 'supertest';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import updateItemPatch from '../../../src/api/v1/profile/controllers/updateItemPatch';
import profileService from '../../../src/lib/profile';

jest.mock('../../../src/lib/profile');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.patch('/api/v1/profiles/:id', updateItemPatch);

describe('Update Item (PATCH) Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should update an item using PATCH and return status 200', async () => {
    // Mock the profileService.updateProperties method to return a profile
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

    (profileService.updateProperties as jest.Mock).mockResolvedValue(mockProfile);

    // Define the updated properties in the request body
    const updatedProperties = {
      firstName: 'Anisur',
      lastName: 'Rahman',
      email: 'anis@gmail.com',
      profilePic: 'profile1.jpg',
      age: 23,
      height: 6,
      weight: 60,
      fitnessLevel: 'beginner',
      goal: 'build_muscle',
    };

    const response = await request(app)
      .patch(`/api/v1/profiles/:id`)
      .send(updatedProperties)
      .expect(200);

    // Ensure that the response status is 200 (OK)
    expect(response.status).toBe(200);
  });
});

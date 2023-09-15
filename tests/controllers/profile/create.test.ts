import request from 'supertest';
import express from 'express';
import create from '../../../src/api/v1/profile/controllers/create';
import profileService from '../../../src/lib/profile';

// Create an Express app and use the findAllItems controller
const app = express();
app.use(express.json());
app.post('/api/v1/profiles', create);

jest.mock('../../../src/lib/profile');

describe('Create Profile Controller', () => {
  it('should create a new profile and return it with status 201', async () => {
    const mockProfile = {
      id: 'profile123',
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@gmail.com',
      profilePic: 'profile1.jpg',
      age: 23,
      height: 6,
      weight: 60,
      fitnessLevel: 'beginner',
      goal: 'build_muscle',
      user: 'user123',
    };

    // Mock the create method of profileService to return the mock profile
    (profileService.create as jest.Mock).mockResolvedValue(mockProfile);

    const requestBody = {
      firstName: 'Ali',
      lastName: 'Akkas',
      email: 'akkas@gmail.com',
      profilePic: 'profile1.jpg',
      age: 23,
      height: 6,
      weight: 60,
      fitnessLevel: 'beginner',
      goal: 'build_muscle',
      user: 'user123',
    };

    // Make a POST request to the controller's route with the request body
    const response = await request(app).post('/api/v1/profiles').send(requestBody).expect(201);

    // Add assertions to check the response body and links
    expect(response.body).toHaveProperty('code', 201);
    expect(response.body).toHaveProperty('message', 'User Profile Created Successfully');
    expect(response.body).toHaveProperty('data', mockProfile);
    expect(response.body).toHaveProperty('links');
  });
});

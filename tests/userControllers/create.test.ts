import request from 'supertest';
import express from 'express';
import userService from '../../src/lib/user';

// Import the controller function
import createController from '../../src/api/v1/user/controllers/create';

// Mock the userService module
jest.mock('../../src/lib/user', () => ({
  create: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/users', createController);

describe('User Creation Controller', () => {
  it('should create a new user', async () => {
    // Mock the userService.create function to return a user object
    const mockUser = {
      _id: 'someUserId',
      name: 'Ali Akkas',
      email: 'ali@gmil.com',
      password: 'pass123',
      role: 'user',
      status: 'pending',
    };

    (userService.create as jest.Mock).mockResolvedValue(mockUser);

    const newUser = {
      name: 'Ali Akkas',
      email: 'ali@gmil.com',
      password: 'pass123',
      role: 'user',
      status: 'pending',
    };

    const response = await request(app).post('/api/v1/users').send(newUser).expect(201);

    // Assertions
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual(mockUser);
  });
});

import request from 'supertest';
import express from 'express';
import createController from '../../../src/api/v1/user/controllers/create';
import userService from '../../../src/lib/user';

// Mock the userService
jest.mock('../../../src/lib/user', () => ({
  create: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/users', createController);

describe('User Creation Controller', () => {
  it('should create a new user', async () => {
    const mockUser = {
      _id: '125335Id',
      name: 'Ali Akkas',
      email: 'ali@gmil.com',
      password: 'pass123',
      role: 'user',
      status: 'pending',
    };

    (userService.create as jest.Mock).mockResolvedValue(mockUser);

    const requestBody = {
      name: 'Ali Akkas',
      email: 'ali@gmil.com',
      password: 'pass123',
      role: 'user',
      status: 'pending',
    };

    const response = await request(app).post('/api/v1/users').send(requestBody).expect(201);

    // Assertions
    expect(response.body).toHaveProperty('data', mockUser);
  });
});

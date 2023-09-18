import request from 'supertest';
// import { Request, Response, NextFunction } from 'express';
// import register from '../../../src/api/v1/auth/controllers/register';
import authService from '../../../src/lib/auth';
// import tokenService from '../../../src/lib/token';
import app from '../../../src/app';
import { connectDB, clearDB, disconnectDB } from '../../../src/config/dbConnection';

// Mock authService.register to simulate user registration
jest.mock('../../../src/lib/auth', () => ({
  register: jest.fn(),
}));

// Mock tokenService.generateAccessToken
jest.mock('../../../src/lib/token', () => ({
  generateAccessToken: jest.fn(() => 'mockAccessToken'),
}));

// Mock the user data returned by authService.register
const mockUser = {
  id: 'user123',
  name: 'Test User',
  email: 'test@gmail.com',
  role: 'user',
};

describe('Register Controller', () => {
  beforeAll(async () => {
    // Connect to the test database before running the tests
    await connectDB();
  });

  afterAll(async () => {
    // Disconnect from the test database after all tests are done
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clear the test database or perform any other necessary setup
    await clearDB();
  });

  it('should register a new user and return an access token with status 201', async () => {
    // Mock the authService.register function to resolve with mockUser
    (authService.register as jest.Mock).mockResolvedValue(mockUser);

    const requestBody = {
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'pass123',
    };

    const response = await request(app).post('/api/v1/auth/register').send(requestBody).expect(201);

    // Assertions
    expect(response.body).toHaveProperty('code', 201);
    expect(response.body).toHaveProperty('message', 'Account Created Successfully');
    expect(response.body.data).toHaveProperty('access_token', 'mockAccessToken');
  });

  // it('should handle errors and call the next function', async () => {
  //   // Mock the authService.register function to reject with an error
  //   authService.register.mockRejectedValue(new Error('Registration failed'));

  //   const requestBody = {
  //     name: 'Test User',
  //     email: 'test@gmail.com',
  //     password: 'pass123',
  //   };

  //   const response = await request(app).post('/api/v1/auth/register').send(requestBody).expect(500); // Assuming you return a 500 status code for errors

  //   // Assertions
  //   expect(response.body).toHaveProperty('error', 'Registration failed');
  // });
});

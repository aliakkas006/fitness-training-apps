import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import refresh from '../../../src/api/v1/token/controllers/refresh';
import tokenService from '../../../src/lib/token';

jest.mock('../../../src/lib/token');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/tokens/refresh', refresh);

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should refresh the token and return new access and refresh tokens with status 201', async () => {
    const mockTokens = {
      accessToken: 'new_access_token',
      refreshToken: 'new_refresh_token',
    };

    // Mock the tokenService.rotateRefreshToken method to return the mock tokens
    (tokenService.rotateRefreshToken as jest.Mock).mockResolvedValue(mockTokens);

    // Define the request body with the refresh token
    const requestBody = {
      token: 'old_refresh_token',
    };

    const response = await request(app)
      .post('/api/v1/tokens/refresh')
      .send(requestBody)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: 'Successfully generated a new Access Token and Refresh Token',
      data: {
        access_token: mockTokens.accessToken,
        refresh_token: mockTokens.refreshToken,
      },
      links: {
        self: '/api/v1/tokens/refresh',
      },
    });
  });

  it('should handle errors and call next with an error', async () => {
    const error = new Error('Token refresh failed');

    // Mock the tokenService.rotateRefreshToken method to throw an error
    (tokenService.rotateRefreshToken as jest.Mock).mockRejectedValue(error);

    // Define the request body
    const requestBody = {
      token: 'old_refresh_token',
    };

    const response = await request(app).post('/api/v1/tokens/refresh').send(requestBody).expect(500);

    expect(response.status).toBe(500);
  });
});

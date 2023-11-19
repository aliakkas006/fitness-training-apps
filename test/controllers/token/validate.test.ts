import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import validate from '../../../src/api/v1/token/controllers/validate';
import tokenService from '../../../src/lib/token';

jest.mock('../../../src/lib/token');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/tokens/validate', validate);

describe('Validate Token Controller', () => {
  beforeAll(async () => {
    connectTestDB();
  });

  afterAll(async () => {
    disconnectTestDB();
  });

  it('should validate a token and return status 200 if valid', async () => {
    // Mock the tokenService.checkRefreshTokenValidity method to return true (valid)
    (tokenService.checkRefreshTokenValidity as jest.Mock).mockResolvedValue(true);

    // Define the request body with the token to validate
    const requestBody = {
      token: 'valid_refresh_token',
    };

    const response = await request(app)
      .post('/api/v1/tokens/validate')
      .send(requestBody)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Token is valid!' });
  });

  it('should handle errors and call next with an error', async () => {
    const error = new Error('Token validation failed');

    // Mock the tokenService.checkRefreshTokenValidity method to throw an error
    (tokenService.checkRefreshTokenValidity as jest.Mock).mockRejectedValue(error);

    // Define the request body with the token to validate
    const requestBody = {
      token: 'invalid_refresh_token',
    };
    const response = await request(app)
      .post('/api/v1/tokens/validate')
      .send(requestBody)
      .expect(500);

    expect(response.status).toBe(500);
  });
});

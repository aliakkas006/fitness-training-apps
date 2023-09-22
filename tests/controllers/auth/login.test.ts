import request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import login from '../../../src/api/v1/auth/controllers/login';
import authService from '../../../src/lib/auth';
import app from '../../../src/app';

describe('Login controller', () => {
  it('should log in a user and return an access token and refresh token with status 200', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'password123',
    };

    // Mock authService.login to return tokens
    const mockLogin = jest.spyOn(authService, 'login');
    mockLogin.mockResolvedValue({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    });

    const response = await request(app).post('/api/v1/auth/login').send(requestBody).expect(200);

    // Assertions
    expect(response.body).toHaveProperty('code', 200);
    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body.data).toHaveProperty('access_token', 'mockAccessToken');
    expect(response.body.data).toHaveProperty('refresh_token', 'mockRefreshToken');

    expect(mockLogin).toHaveBeenCalledWith({
      email: requestBody.email,
      password: requestBody.password,
      issuedIp: '::ffff:127.0.0.1',
    });
  });

  it('should handle errors and call the next function', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'password123',
    };

    const mockLogin = jest.spyOn(authService, 'login');
    mockLogin.mockRejectedValue(new Error('Invalid Credentials!'));

    const req = {
      body: requestBody,
      clientIp: '127.0.0.1',
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

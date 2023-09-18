import request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import register from '../../../src/api/v1/auth/controllers/register';
import authService from '../../../src/lib/auth';
import tokenService from '../../../src/lib/token';
import app from '../../../src/app';

describe('Register controller', () => {
  it('should register a new user and return an access token with status 201', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'pass123',
    };

    // Mock authService.register to return a user object
    const mockRegister = jest.spyOn(authService, 'register');
    mockRegister.mockResolvedValue({
      id: 'user123',
      name: requestBody.name,
      email: requestBody.email,
      role: 'user',
    });

    // Mock tokenService.generateAccessToken to return a mock access token
    const mockGenerateAccessToken = jest.spyOn(tokenService, 'generateAccessToken');
    mockGenerateAccessToken.mockReturnValue('mockAccessToken');

    const response = await request(app).post('/api/v1/auth/register').send(requestBody).expect(201);

    // Assertions
    expect(response.body).toHaveProperty('code', 201);
    expect(response.body).toHaveProperty('message', 'Account Created Successfully');
    expect(response.body.data).toHaveProperty('access_token', 'mockAccessToken');

    expect(mockRegister).toHaveBeenCalledWith({
      name: requestBody.name,
      email: requestBody.email,
      password: requestBody.password,
    });

    const payload = {
      id: 'user123',
      name: requestBody.name,
      email: requestBody.email,
      role: 'user',
    };

    expect(mockGenerateAccessToken).toHaveBeenCalledWith({ payload });
  });

  it('should handle errors and call the next function', async () => {
    const requestBody = {
      name: 'Test User',
      email: 'test@gamil.com',
      password: 'pass123',
    };

    const mockRegister = jest.spyOn(authService, 'register');
    mockRegister.mockRejectedValue(new Error('Registration failed'));

    const req = {
      body: requestBody,
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await register(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

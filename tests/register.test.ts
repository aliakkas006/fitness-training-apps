import { Request, Response, NextFunction } from 'express';
import authService from '../src/lib/auth';
import authControleer from '../src/api/v1/auth';
import { badRequest } from '../src/utils/CustomError';

// Mock the dependencies or functions used within the register function
jest.mock('../src/lib/auth', () => ({
  register: jest.fn(),
}));

jest.mock('../src/utils/CustomError', () => ({
  badRequest: jest.fn(),
}));

describe('Register Controller', () => {
  it('should register a new user', async () => {
    const req = {
      body: {
        name: 'Ali Akkas',
        email: 'akkas@gmail.com',
        password: 'pass123',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    // Mock the authService.register function to return a user object
    (authService.register as jest.Mock).mockResolvedValue({
      id: 'user123',
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      role: 'user',
    });

    // Mock the badRequest function
    (badRequest as jest.Mock).mockImplementation((message) => {
      throw new Error(message);
    });

    await authControleer.register(req, res, next);

    expect(authService.register).toHaveBeenCalledWith({
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'pass123',
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      code: 201,
      message: 'Account Created Successfully',
      data: {
        access_token: expect.any(String), 
      },
      links: {
        self: req.url, 
        login: '/api/v1/auth/login',
      },
    });

    expect(next).not.toHaveBeenCalled();
  });
});

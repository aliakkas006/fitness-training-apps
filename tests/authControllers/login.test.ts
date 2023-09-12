import { Request, Response, NextFunction } from 'express';
import authControllers from '../../src/api/v1/auth'; // Replace with your actual controller
import authService from '../../src/lib/auth';
import { badRequest } from '../../src/utils/CustomError';

// Mock the Express Request, Response, and NextFunction
const mockRequest = {} as Request;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as NextFunction;

// Mock the authService.login function
jest.mock('../src/lib/auth');

describe('loginController', () => {
  it('should return access and refresh tokens on successful login', async () => {
    // Mock the request body
    mockRequest.body = {
      email: 'test@example.com',
      password: 'pass123',
    };

    // Mock the authService.login function to return tokens
    const mockTokens = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    };
    (authService.login as jest.Mock).mockResolvedValue(mockTokens);

    const tokens =  await authControllers.login(mockRequest, mockResponse, mockNext);
    console.log('tokens', tokens);

    // Expect the response to be sent with the correct status and JSON data
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      code: 200,
      message: 'Login successful',
      data: {
        access_token: mockTokens.accessToken,
        refresh_token: mockTokens.refreshToken,
      },
      links: {
        self: mockRequest.url,
      },
    });
  });

  it('should call next with an error on login failure', async () => {
    // Mock the request body
    mockRequest.body = {
      email: 'test@example.com',
      password: 'password',
    };

    // Mock the authService.login function to throw an error
    const mockError = badRequest('Invalid Credentials!');
    (authService.login as jest.Mock).mockRejectedValue(mockError);

    await authControllers.login(mockRequest, mockResponse, mockNext);

    // Expect next to be called with the error
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

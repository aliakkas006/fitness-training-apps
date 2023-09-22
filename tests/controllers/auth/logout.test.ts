import { Request, Response, NextFunction } from 'express';
import logout from '../../../src/api/v1/auth/controllers/logout';
import authService from '../../../src/lib/auth';

describe('Logout controller', () => {
  it('should log out a user with status 204', async () => {
    const requestBody = {
      token: 'validAccessToken',
    };

    // Mock authService.logout to resolve
    const mockLogout = jest.spyOn(authService, 'logout');
    mockLogout.mockResolvedValue(undefined);

    const req = {
      body: requestBody,
      clientIp: '127.0.0.1',
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await logout(req, res, next);

    // Assertions
    expect(mockLogout).toHaveBeenCalledWith({
      token: requestBody.token,
      clientIp: req.clientIp,
    });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      code: 204,
      message: 'Logout Successfully!',
      links: {
        self: req.url,
        login: `/api/v1/auth/login`,
      },
    });
  });

  it('should handle errors and call the next function', async () => {
    const requestBody = {
      token: 'invalidAccessToken',
    };

    // Mock authService.logout to reject with an error
    const mockLogout = jest.spyOn(authService, 'logout');
    mockLogout.mockRejectedValue(new Error('Logout Failed!'));

    const req = {
      body: requestBody,
      clientIp: '127.0.0.1',
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await logout(req, res, next);

    // Assertions
    expect(mockLogout).toHaveBeenCalledWith({
      token: requestBody.token,
      clientIp: req.clientIp,
    });

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

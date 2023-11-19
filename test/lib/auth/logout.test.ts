import tokenService from '../../../src/lib/token';
import User from '../../../src/model/User';
import authService from '../../../src/lib/auth';

jest.mock('../../../src/lib/token', () => ({
  revokeRefreshToken: jest.fn(),
}));

jest.mock('../../../src/model/User', () => ({
  findById: jest.fn(),
}));

describe('Logout Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log out a user', async () => {
    const mockRefreshToken = 'mockRefreshToken';
    const mockUser = {
      _id: 'userId',
      status: 'approved',
    };

    (tokenService.revokeRefreshToken as jest.Mock).mockResolvedValue(mockRefreshToken);
    (User.findById as jest.Mock).mockResolvedValue(mockUser);

    const logoutParams = {
      token: 'validRefreshToken',
      clientIp: '192.168.0.1',
    };

    await authService.logout(logoutParams);

    // Expectations
    expect(tokenService.revokeRefreshToken).toHaveBeenCalledWith(logoutParams);

    // Ensure that the user's status is updated to 'blocked'
    expect(mockUser.status).toBe('blocked');
  });

  it('should handle errors during logout', async () => {
    // Mock tokenService.revokeRefreshToken to reject with an error
    (tokenService.revokeRefreshToken as jest.Mock).mockRejectedValue(
      new Error('Token Revocation Failed!')
    );

    const logoutParams = {
      token: 'invalidRefreshToken',
      clientIp: '192.168.0.1',
    };

    // Expect the logout function to throw an error
    await expect(authService.logout(logoutParams)).rejects.toThrowError('Token Revocation Failed!');

    // Ensure that User.findById is not called
    expect(User.findById).not.toHaveBeenCalled();
  });
});

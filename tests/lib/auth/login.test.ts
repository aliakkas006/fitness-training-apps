import userService from '../../../src/lib/user';
import { hashMatched } from '../../../src/utils/hashing';
import { badRequest } from '../../../src/utils/error';
import authService from '../../../src/lib/auth';
import tokenService from '../../../src/lib/token';
import { LoginParam } from '../../../src/types/interfaces';

jest.mock('../../../src/lib/user', () => ({
  findUserByEmail: jest.fn(),
}));

jest.mock('../../../src/utils/hashing', () => ({
  hashMatched: jest.fn(),
}));

jest.mock('../../../src/lib/token', () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

describe('Login Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully log in a user', async () => {
    const mockUser = {
      id: 'userId',
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'hashedPassword',
      role: 'user',
    };
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    (hashMatched as jest.Mock).mockResolvedValue(true);

    (tokenService.generateAccessToken as jest.Mock).mockReturnValue('mockAccessToken');
    (tokenService.generateRefreshToken as jest.Mock).mockReturnValue('mockRefreshToken');

    const validLogin: LoginParam = {
      email: 'akkas@gmail.com',
      password: 'password123',
      issuedIp: '192.168.0.1',
    };

    const result = await authService.login(validLogin);
    console.log('result', result);

    const aTokenPayload = {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    };

    // Expectations
    expect(userService.findUserByEmail).toHaveBeenCalledWith('akkas@gmail.com');
    expect(hashMatched).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(tokenService.generateAccessToken).toHaveBeenCalledWith({ payload: aTokenPayload });
    expect(tokenService.generateRefreshToken).toHaveBeenCalledWith({
      userId: mockUser.id,
      issuedIp: '192.168.0.1',
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });
    expect(result).toEqual({
      accessToken: 'mockAccessToken',
      refreshToken: 'mockRefreshToken',
    });
  });

  it('should throw an error for invalid credentials', async () => {
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(false);

    const invalidLogin: LoginParam = {
      email: 'nonexistent@example.com',
      password: 'password123',
      issuedIp: '192.168.0.1',
    };

    // Expect the login to throw an error
    await expect(authService.login(invalidLogin)).rejects.toThrowError(
      badRequest('Invalid Credentials!')
    );

    // Ensure that hashMatched, generateAccessToken, and generateRefreshToken are not called
    expect(hashMatched).not.toHaveBeenCalled();
    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
    expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
  });

  it('should throw an error for incorrect password', async () => {
    const mockUser = {
      id: 'userId',
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'hashedPassword',
      role: 'user',
    };
    (userService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

    // Mock the hashMatched function to return false (passwords do not match)
    (hashMatched as jest.Mock).mockResolvedValue(false);

    // Define login parameters with an incorrect password
    const incorrectPasswordLogin: LoginParam = {
      email: 'akkas@gmail.com',
      password: 'incorrectPassword',
      issuedIp: '192.168.0.1',
    };

    // Expect the login to throw an error
    await expect(authService.login(incorrectPasswordLogin)).rejects.toThrowError(
      badRequest('Invalid Credentials!')
    );

    // Ensure that generateAccessToken and generateRefreshToken are not called
    expect(tokenService.generateAccessToken).not.toHaveBeenCalled();
    expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
  });
});

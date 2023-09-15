import userService from '../../../src/lib/user';
import { generateHash } from '../../../src/utils/hashing';
import { badRequest } from '../../../src/utils/error';
import authService, { RegisterParam } from '../../../src/lib/auth';

jest.mock('../../../src/lib/user', () => ({
  userExist: jest.fn(),
  createAccount: jest.fn(),
}));

jest.mock('../../../src/utils/hashing', () => ({
  generateHash: jest.fn(),
}));

describe('Register Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    // Mock the userService.userExist function to return false (user does not exist)
    (userService.userExist as jest.Mock).mockResolvedValue(false);

    // Mock the userService.createAccount function to return a user object
    const mockUser = {
      id: 'user123',
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
    };
    (userService.createAccount as jest.Mock).mockResolvedValue(mockUser);

    // Mock the generateHash function to hash the password
    (generateHash as jest.Mock).mockResolvedValue('hashedPassword');

    // Define valid registration parameters
    const validRegistration: RegisterParam = {
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'pass123',
    };

    // Call the register function with valid parameters
    const result = await authService.register(validRegistration);

    // Expectations
    expect(userService.userExist).toHaveBeenCalledWith('akkas@gmail.com');
    expect(generateHash).toHaveBeenCalledWith('pass123');
    expect(userService.createAccount).toHaveBeenCalledWith({
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'hashedPassword',
    });
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if the user already exists', async () => {
    (userService.userExist as jest.Mock).mockResolvedValue(true);

    const existingUserRegistration: RegisterParam = {
      name: 'Ali Akkas',
      email: 'akkas@gmail.com',
      password: 'pass123',
    };

    // Expect the registration to throw an error
    await expect(authService.register(existingUserRegistration)).rejects.toThrowError(
      badRequest('User Already Exist')
    );

    expect(userService.createAccount).not.toHaveBeenCalled();
    expect(generateHash).not.toHaveBeenCalled();
  });
});

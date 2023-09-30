import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import changePassword from '../../../src/api/v1/user/controllers/changePassword';
import userService from '../../../src/lib/user';

jest.mock('../../../src/lib/user');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.patch('/api/v1/users/:id/password', changePassword);

describe('Change Password Controller', () => {
  beforeAll(async () => {
    await await connectTestDB();
  });

  afterAll(async () => {
    await await disconnectTestDB();
  });

  it('should change the password and return status 200', async () => {
    const mockUserId = 'user123';

    // Mock the userService.changePassword method to indicate a successful password change
    (userService.changePassword as jest.Mock).mockResolvedValue({ id: mockUserId });

    // Define the request body
    const requestBody = {
      password: 'newPassword123',
    };

    const response = await request(app)
      .patch(`/api/v1/users/${mockUserId}/password`)
      .send(requestBody)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should handle errors and call next with an error', async () => {
    const mockUserId = 'user123';

    // Mock the userService.changePassword method to simulate an error
    const error = new Error('Password change failed');
    (userService.changePassword as jest.Mock).mockRejectedValue(error);

    const requestBody = {
      password: 'newPassword123',
    };

    const response = await request(app)
      .patch(`/api/v1/users/${mockUserId}/password`)
      .send(requestBody)
      .expect(500);

    expect(response.status).toBe(500);
  });
});

import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import updateItemPatch from '../../../src/api/v1/user/controllers/updateItemPatch';
import userService from '../../../src/lib/user';

jest.mock('../../../src/lib/user');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.patch('/api/v1/users/:id', updateItemPatch);

describe('Update User Property Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should update a user property and return status 200', async () => {
    const mockUserId = 'user123';
    const requestBody = {
      name: 'Ali Akkas',
      email: 'ali@gmail.com',
      role: 'user',
      status: 'approved',
    };

    // Mock the userService.updateProperties method to return the updated user
    const updatedUser = {
      id: mockUserId,
      ...requestBody,
    };

    (userService.updateProperties as jest.Mock).mockResolvedValue(updatedUser);

    const response = await request(app)
      .patch(`/api/v1/users/${mockUserId}`)
      .send(requestBody)
      .expect(200);

    expect(response.status).toBe(200);
  });

  it('should handle errors', async () => {
    const mockUserId = 'user123';
    const requestBody = {
      name: 'Ali Akkas',
      email: 'ali@gmail.com',
      role: 'user',
      status: 'approved',
    };
    const error = new Error('User property update failed');

    // Mock the userService.updateProperties method to simulate an error
    (userService.updateProperties as jest.Mock).mockRejectedValue(error);

    const response = await request(app)
      .patch(`/api/v1/users/${mockUserId}`)
      .send(requestBody)
      .expect(500);

    expect(response.status).toBe(500);
  });
});

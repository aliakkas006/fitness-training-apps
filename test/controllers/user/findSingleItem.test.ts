import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findSingleItem from '../../../src/api/v1/user/controllers/findSingleItem';
import userService from '../../../src/lib/user';

jest.mock('../../../src/lib/user');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.get('/api/v1/users/:id', findSingleItem);

describe('Find Single User Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should return a user when it exists', async () => {
    const mockUserId = 'user123';

    const mockUser = {
      id: mockUserId,
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
    };

    // Mock the userService.findSingleItem method to return the mock user
    (userService.findSingleItem as jest.Mock).mockResolvedValue(mockUser);

    const response = await request(app).get(`/api/v1/users/${mockUserId}`).expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: 'Successfully fetch a user',
      data: mockUser,
      links: {
        self: `/api/v1/users/${mockUserId}`,
      },
    });
  });

  it('should handle errors and call next with an error', async () => {
    const mockUserId = 'user123';

    const error = new Error('User retrieval failed');
    (userService.findSingleItem as jest.Mock).mockRejectedValue(error);

    const response = await request(app).get(`/api/v1/users/${mockUserId}`).expect(500);

    expect(response.status).toBe(500);
  });
});

import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db'; 
import removeItem from '../../../src/api/v1/user/controllers/removeItem';
import userService from '../../../src/lib/user';

jest.mock('../../../src/lib/user');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.delete('/api/v1/users/:id', removeItem);

describe('Remove User Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should remove a user and return status 204', async () => {
    const mockUserId = 'user123';

    // Mock the userService.removeItem method to indicate a successful user removal
    (userService.removeItem as jest.Mock).mockResolvedValue({});

    const response = await request(app).delete(`/api/v1/users/${mockUserId}`).expect(204);

    // Ensure that the response status is 204 (No Content)
    expect(response.status).toBe(204);
  });

  it('should handle errors and call next with an error', async () => {
    const mockUserId = 'user123';

    // Mock the userService.removeItem method to simulate an error
    const error = new Error('User removal failed');
    (userService.removeItem as jest.Mock).mockRejectedValue(error);

    const response = await request(app).delete(`/api/v1/users/${mockUserId}`).expect(500);

    expect(response.status).toBe(500);
  });
});

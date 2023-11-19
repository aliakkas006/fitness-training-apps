import express from 'express';
import request from 'supertest';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import removeItem from '../../../src/api/v1/profile/controllers/removeItem';
import profileService from '../../../src/lib/profile';

jest.mock('../../../src/lib/profile', () => ({
  removeItem: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.delete('/api/v1/profiles/:id', removeItem);

describe('Remove Item Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should remove an item and return status 204', async () => {
    // Mock the profileService.removeItem method to indicate a successful removal
    (profileService.removeItem as jest.Mock).mockResolvedValue({});

    const response = await request(app).delete(`/api/v1/profiles/:id`).expect(204);

    // Ensure that the response status is 204 (No Content)
    expect(response.status).toBe(204);
  });
});

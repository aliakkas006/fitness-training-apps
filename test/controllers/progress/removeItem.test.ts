import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db'; // Import your test database setup functions
import removeItem from '../../../src/api/v1/progress/controllers/removeItem';
import progressService from '../../../src/lib/progress';

jest.mock('../../../src/lib/progress');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.delete('/api/v1/progress/:id', removeItem);

describe('Remove Progress Item Controller', () => {
  beforeAll(async () => {
    await await connectTestDB();
  });

  afterAll(async () => {
    await await disconnectTestDB();
  });

  it('should remove a progress item and return status 204', async () => {
    // Mock the progressService.removeItem method to indicate a successful removal
    (progressService.removeItem as jest.Mock).mockResolvedValue({});

    const response = await request(app).delete(`/api/v1/progress/:id`).expect(204);

    expect(response.status).toBe(204);
  });
});

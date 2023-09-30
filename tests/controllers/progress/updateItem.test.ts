import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import updateItemPatch from '../../../src/api/v1/progress/controllers/updateItemPatch';
import progressService from '../../../src/lib/progress';

jest.mock('../../../src/lib/progress');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.patch('/api/v1/progress/:id', updateItemPatch);

describe('Update Progress Property Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should update progress property and return status 200', async () => {
    const mockProgress = {
      id: 'progress1',
      workoutSession: '1 hr',
      trackProgress: {
        newWeight: '6 feet',
        newHeight: '60 kg',
        newFitnessLevel: 'intermmediate',
        achievedGoal: 'maintain_fitness',
      },
      performance: 'excellent',
      status: 'public',
      builder: 'user123',
      workoutId: 'workout123',
    };

    // Mock the progressService.updateProperties method to return the mock progress
    (progressService.updateProperties as jest.Mock).mockResolvedValue(mockProgress);

    const requestBody = {
      workoutSession: '1 hr',
      trackProgress: {
        newWeight: '6 feet',
        newHeight: '60 kg',
        newFitnessLevel: 'intermmediate',
        achievedGoal: 'maintain_fitness',
      },
      performance: 'excellent',
      status: 'public',
    };

    const response = await request(app).patch('/api/v1/progress/:id').send(requestBody).expect(200);

    expect(response.status).toBe(200);
  });
});

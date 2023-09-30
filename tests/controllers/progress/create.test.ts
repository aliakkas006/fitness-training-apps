import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import create from '../../../src/api/v1/progress/controllers/create';
import progressService from '../../../src/lib/progress';

jest.mock('../../../src/lib/progress');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/progress', create);

describe('Create Progress Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should create progress and return status 201', async () => {
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

    // Mock the progressService.create method to return the mock progress
    (progressService.create as jest.Mock).mockResolvedValue(mockProgress);

    // Define the request body
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
      workoutId: 'workout123',
    };

    const response = await request(app).post('/api/v1/progress').send(requestBody).expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: 'Progress Created Successfully',
      data: mockProgress,
      links: {
        self: '/api/v1/progress',
      },
    });
  });
});

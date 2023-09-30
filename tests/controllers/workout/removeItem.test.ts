import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import removeItem from '../../../src/api/v1/workout/controllers/removeItem';
import workoutPlanService from '../../../src/lib/workoutPlan';

jest.mock('../../../src/lib/workoutPlan');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.delete('/api/v1/workouts/:id', removeItem);

describe('Remove Workout Plan Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should remove a workout plan and return status 204', async () => {
    (workoutPlanService.removeItem as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app).delete('/api/v1/workouts/1').expect(204);

    expect(response.status).toBe(204);
  });

  it('should handle errors and call next with an error', async () => {
    const error = new Error('Workout Plan removal failed');

    // Mock the workoutPlanService.removeItem method to throw an error
    (workoutPlanService.removeItem as jest.Mock).mockRejectedValue(error);
    const response = await request(app).delete('/api/v1/workouts/2').expect(500);

    // Validate the response status code for an error scenario
    expect(response.status).toBe(500);
  });
});

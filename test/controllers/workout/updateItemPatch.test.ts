import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import updateItemPatch from '../../../src/api/v1/workout/controllers/updateItemPatch';
import workoutPlanService from '../../../src/lib/workoutPlan';

jest.mock('../../../src/lib/workoutPlan');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.patch('/api/v1/workouts/:id', updateItemPatch);

describe('Update Workout Plan Patch Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should update an existing workout plan with partial data and return status 200', async () => {
    const mockWorkoutPlan = {
      id: 'workoutPlan123',
      name: 'Updated Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Exercise 1', 'Exercise 2'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
      builder: { id: 'user123' },
    };

    // Mock the workoutPlanService.updateProperties method to return the mock workoutPlan
    (workoutPlanService.updateProperties as jest.Mock).mockResolvedValue(mockWorkoutPlan);

    // Define the request body with partial data
    const requestBody = {
      name: 'Updated Workout Plan',
      mode: 'advanced',
      exercises: ['Exercise 1', 'Exercise 2'],
    };

    const response = await request(app)
      .patch('/api/v1/workouts/workoutPlan123')
      .send(requestBody)
      .expect(200);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      code: 200,
      message: 'Workout plan updated successfully',
      data: mockWorkoutPlan,
      links: {
        self: '/api/v1/workouts/workoutPlan123',
      },
    });
  });

  it('should handle errors and call next with an error', async () => {
    const error = new Error('Workout Plan patch failed');

    // Mock the workoutPlanService.updateProperties method to throw an error
    (workoutPlanService.updateProperties as jest.Mock).mockRejectedValue(error);

    // Define the request body
    const requestBody = {
      name: 'Updated Workout Plan',
      mode: 'advanced',
      exercises: ['Exercise 1', 'Exercise 2'],
    };

    const response = await request(app)
      .patch('/api/v1/workouts/workoutPlan123')
      .send(requestBody)
      .expect(500);

    expect(response.status).toBe(500);
  });
});

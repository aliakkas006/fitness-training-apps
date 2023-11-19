import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import updateItem from '../../../src/api/v1/workout/controllers/updateItem';
import workoutPlanService from '../../../src/lib/workoutPlan';

jest.mock('../../../src/lib/workoutPlan');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.put('/api/v1/workouts/:id', updateItem);

describe('Update Workout Plan Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should update an existing workout plan and return status 200', async () => {
    const mockWorkoutPlan = {
      id: 'workoutPlan123',
      name: 'Updated Workout Plan',
      mode: 'Advanced',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
      builder: { id: 'user123' },
    };

    // Mock the workoutPlanService.updateOrCreate method to return the mock workoutPlan
    (workoutPlanService.updateOrCreate as jest.Mock).mockResolvedValue({
      workoutPlan: mockWorkoutPlan,
      code: 200,
    });

    // Define the request body with updated data
    const requestBody = {
      name: 'Updated Workout Plan',
      mode: 'Advanced',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
    };

    const response = await request(app)
      .put('/api/v1/workouts/workoutPlan123')
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

  it('should create a new workout plan and return status 201 if it does not exist', async () => {
    const mockWorkoutPlan = {
      id: 'newWorkoutPlan123',
      name: 'New Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
      builder: { id: 'user123' },
    };

    // Mock the workoutPlanService.updateOrCreate method to return the mock workoutPlan as a new creation
    (workoutPlanService.updateOrCreate as jest.Mock).mockResolvedValue({
      workoutPlan: mockWorkoutPlan,
      code: 201,
    });

    // Define the request body for a new workout plan
    const requestBody = {
      name: 'New Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
    };

    const response = await request(app)
      .put('/api/v1/workouts/newWorkoutPlan123')
      .send(requestBody)
      .expect(201);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      code: 201,
      message: 'Workout plan created successfully',
      data: mockWorkoutPlan,
      links: {
        self: '/api/v1/workouts/newWorkoutPlan123',
      },
    });
  });

  it('should handle errors', async () => {
    const error = new Error('Workout Plan update failed');

    // Mock the workoutPlanService.updateOrCreate method to throw an error
    (workoutPlanService.updateOrCreate as jest.Mock).mockRejectedValue(error);

    // Define the request body
    const requestBody = {
      name: 'Updated Workout Plan',
      mode: 'Advanced',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
    };

    const response = await request(app)
      .put('/api/v1/workouts/workoutPlan123')
      .send(requestBody)
      .expect(500);

    expect(response.status).toBe(500);
  });
});

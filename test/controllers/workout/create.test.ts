import express from 'express';
import request from 'supertest';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import createController from '../../../src/api/v1/workout/controllers/create';
import workoutPlanService from '../../../src/lib/workoutPlan';

// Mock the workoutPlanService
jest.mock('../../../src/lib/workoutPlan', () => ({
  create: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/workouts', createController);

describe('Create Workout Plan Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should create a new workout plan', async () => {
    // Mock the workoutPlanService.create function to return a workout plan object
    const mockWorkoutPlan = {
      id: 'someWorkoutPlanId',
      name: 'Sample Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
      builder: { id: 'user123' },
    };

    (workoutPlanService.create as jest.Mock).mockResolvedValue(mockWorkoutPlan);

    const requestBody = {
      name: 'Example Workout Plan',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      trainerTips: ['Start slowly and increase intensity over time.'],
      photo: 'workout.jpg',
      status: 'progress',
    };
    const response = await request(app).post('/api/v1/workouts').send(requestBody).expect(201);

    // Assertions
    expect(response.body).toHaveProperty('data', mockWorkoutPlan);
  });
});

import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findSingleItem from '../../../src/api/v1/workout/controllers/findSingleItem';
import workoutPlanService from '../../../src/lib/workoutPlan';

jest.mock('../../../src/lib/workoutPlan');

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.get('/api/v1/workouts/:id', findSingleItem);

describe('Find Single Workout Plan Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should return a single workout plan when it exists', async () => {
    const mockWorkoutPlan = {
      id: '1',
      name: 'Workout Plan 1',
      mode: 'Beginner',
      equipment: ['Dumbbells', 'Bench'],
      exercises: ['Push-ups', 'Squats'],
      builder: 'user123',
    };

    // Mock the workoutPlanService.findSingleItem method to return the mock workout plan
    (workoutPlanService.findSingleItem as jest.Mock).mockResolvedValue(mockWorkoutPlan);

    const response = await request(app).get('/api/v1/workouts/1').expect(200);

    // Validate the content of the returned workout plan
    expect(response.body.data).toEqual({
      id: mockWorkoutPlan.id,
      name: mockWorkoutPlan.name,
      mode: mockWorkoutPlan.mode,
      equipment: mockWorkoutPlan.equipment,
      exercises: mockWorkoutPlan.exercises,
      builder: mockWorkoutPlan.builder,
    });

    // Validate the links in the response
    expect(response.body.links).toEqual({
      self: '/api/v1/workouts/1',
      builder: '/api/v1/workouts/1/builder',
      progress: '/api/v1/workouts/1/progress',
    });
  });
});

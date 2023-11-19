import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findAllItems from '../../../src/api/v1/workout/controllers/findAllItems';
import workoutPlanService from '../../../src/lib/workoutPlan';
import query from '../../../src/utils/query';
import defaults from '../../../src/config/defaults';

// Mock the workoutPlanService and query modules
jest.mock('../../../src/lib/workoutPlan', () => ({
  findAllItems: jest.fn(),
  count: jest.fn(),
}));

jest.mock('../../../src/utils/query', () => ({
  getTransformedItems: jest.fn(),
  getPagination: jest.fn(),
  getHATEOASForAllItems: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.get('/api/v1/workouts', findAllItems);

describe('Find All Workout Plans Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should return a list of workout plans', async () => {
    const mockWorkoutPlans = [
      {
        _id: 'workout123',
        name: 'Workout Plan 1',
        mode: 'Beginner',
        equipment: ['Dumbbells', 'Bench'],
        exercises: ['Push-ups', 'Squats'],
        builder: 'user123',
      },
      {
        _id: 'workout232',
        name: 'Workout Plan 2',
        mode: 'Intermediate',
        equipment: ['Barbell', 'Bench'],
        exercises: ['Deadlift', 'Bicep Curls'],
        builder: 'user1245',
      },
    ];

    (workoutPlanService.findAllItems as jest.Mock).mockResolvedValue(mockWorkoutPlans);

    // Mock the query functions to return expected values
    (query.getTransformedItems as jest.Mock).mockReturnValue(mockWorkoutPlans);
    (query.getPagination as jest.Mock).mockReturnValue({ totalItems: 2, limit: 10, page: 1 });
    (query.getHATEOASForAllItems as jest.Mock).mockReturnValue({ next: null, prev: null });

    const response = await request(app)
      .get('/api/v1/workouts')
      .query({
        page: defaults.page,
        limit: defaults.limit,
        sort_type: defaults.sortType,
        sort_by: defaults.sortBy,
        search: defaults.search,
      })
      .expect(200);

    // Assertions
    expect(response.body).toHaveProperty('data', mockWorkoutPlans);
    expect(response.body).toHaveProperty('pagination', { totalItems: 2, limit: 10, page: 1 });
    expect(response.body).toHaveProperty('links', { next: null, prev: null });
  });
});

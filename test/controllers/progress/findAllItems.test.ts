import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findAllItems from '../../../src/api/v1/progress/controllers/findAllItems';
import progressService from '../../../src/lib/progress';
import query from '../../../src/utils/query';

// Mock the workoutPlanService and query modules
jest.mock('../../../src/lib/progress', () => ({
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
app.get('/api/v1/progress', findAllItems);

describe('Find all progress controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should return a list of progress data with status 200', async () => {
    const mockProgresses = [
      {
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
        builder: { id: 'user123' },
        workout: { id: 'workout123' },
      },
      {
        id: 'progress2',
        workoutSession: '2 hr',
        trackProgress: {
          newWeight: '5 feet',
          newHeight: '60 kg',
          newFitnessLevel: 'Beginner',
          achievedGoal: 'maintain_fitness',
        },
        performance: 'excellent',
        status: 'public',
        builder: { id: 'user123' },
        workout: { id: 'workout123' },
      },
    ];

    // Mock the findAllItems method of progressService to return mock progresses
    (progressService.findAllItems as jest.Mock).mockResolvedValue(mockProgresses);

    // Mock the query functions to return expected values
    (query.getTransformedItems as jest.Mock).mockReturnValue(mockProgresses);
    (query.getPagination as jest.Mock).mockReturnValue({ totalItems: 2, limit: 10, page: 1 });
    (query.getHATEOASForAllItems as jest.Mock).mockReturnValue({ next: null, prev: null });

    const requestQuery = {
      page: '1',
      limit: '10',
      sort_type: 'dsc',
      sort_by: 'updatedAt',
    };

    // Make a GET request to the findAllItems controller's route with the request query
    const response = await request(app).get('/api/v1/progress').query(requestQuery).expect(200);

    // Assertions
    expect(response.body).toHaveProperty('data', mockProgresses);
    expect(response.body).toHaveProperty('pagination', { totalItems: 2, limit: 10, page: 1 });
    expect(response.body).toHaveProperty('links', { next: null, prev: null });
  });

  it('should handle errors and call the next function', async () => {
    (progressService.findAllItems as jest.Mock).mockRejectedValue(new Error('Error message'));
    const requestQuery = {
      page: '1',
      limit: '10',
      sort_type: 'dsc',
      sort_by: 'updatedAt',
    };
    const req = {
      query: requestQuery,
    } as unknown as Request;

    // Create a mock response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Create a mock next function
    const next = jest.fn() as NextFunction;

    // Call the controller function
    await findAllItems(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});

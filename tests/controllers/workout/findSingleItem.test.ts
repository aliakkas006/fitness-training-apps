import express, { Request, Response, NextFunction } from 'express';
import supertest from 'supertest';
 import findSingleItem from '../../../src/api/v1/workout/controllers/findSingleItem'
import workoutPlanService from '../../../src/lib/workoutPlan';

// Mock the workoutPlanService methods
jest.mock('../../../src/lib/workoutPlan', () => ({
  findSingleItem: jest.fn(),
}));

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.get('/api/v1/workouts/:id', findSingleItem);

describe('Find single workout plan Controller', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return a single workout plan', async () => {
    const mockWorkout = {
      id: 'workoutId',
      name: 'Workout Plan 1',
      mode: 'Beginner',
        equipment: ['Dumbbells', 'Bench'],
        exercises: ['Push-ups', 'Squats'],
        builder: 'user123',
    };

    (workoutPlanService.findSingleItem as jest.Mock).mockResolvedValue(mockWorkout);

    // Define a sample request object
    const request = {
      params: { id: 'workoutId' },
      query: {expand: 'builder'},
    }

    // Send a GET request to the route
    const response = await supertest(app)
      .get('/your-route-here/:id')
      .set('Accept', 'application/json')
      .send(request);

    // Expectations
    expect(response.status).toBe(200);
    expect(workoutPlanService.findSingleItem).toHaveBeenCalledWith({
      id: 'workoutId',
      expand: '',
    });

    // Verify the response structure and data
    expect(response.body).toEqual({
      data: mockWorkout,
      links: {
        self: '/your-route-here/:id',
        builder: '/your-route-here/:id/builder',
        progress: '/your-route-here/:id/progress',
      },
    });
  });

  it('should handle errors and call the next middleware', async () => {
    // Mock the workoutPlanService.findSingleItem function to throw an error
    const mockError = new Error('Test error message');
    workoutPlanService.findSingleItem.mockRejectedValue(mockError);

    // Define a sample request object
    const request: Request = {
      params: { id: 'workoutId' },
      query: {},
    } as Request;

    // Define a mock next function to capture the error
    const mockNext: NextFunction = jest.fn();

    // Call the controller function
    await findSingleItem(request, {} as Response, mockNext);

    // Expectations
    expect(workoutPlanService.findSingleItem).toHaveBeenCalledWith({
      id: 'workoutId',
      expand: '',
    });

    // Verify that the next middleware is called with the error
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

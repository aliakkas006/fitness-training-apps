import request from 'supertest';
import express from 'express';
import findAllItemsController from '../../../src/api/v1/user/controllers/findAllItems';
import userService from '../../../src/lib/user';
import query from '../../../src/utils/query';

// Mock the workoutPlanService and query modules
jest.mock('../../../src/lib/user', () => ({
  findAllItems: jest.fn(),
  count: jest.fn(),
}));

jest.mock('../../../src/utils/query', () => ({
  getTransformedItems: jest.fn(),
  getPagination: jest.fn(),
  getHATEOASForAllItems: jest.fn(),
}));

// Create an Express app and use the findAllItems controller
const app = express();
app.use(express.json());
app.get('/api/v1/users', findAllItemsController);

describe('Find All Users Controller', () => {
  it('should return a list of users', async () => {
    // Mock the userService.findAllItems function to return users
    const mockUsers = [
      {
        _id: '125335Id',
        name: 'Ali Akkas',
        email: 'ali@gmil.com',
        password: 'pass123',
        role: 'user',
        status: 'pending',
      },
      {
        _id: '12fa335Id',
        name: 'Rasel Hossain',
        email: 'rasel@gmil.com',
        password: 'pass1453',
        role: 'user',
        status: 'pending',
      },
    ];

    (userService.findAllItems as jest.Mock).mockResolvedValue(mockUsers);

    // Mock the query functions to return expected values
    (query.getTransformedItems as jest.Mock).mockReturnValue(mockUsers);
    (query.getPagination as jest.Mock).mockReturnValue({ totalItems: 2, limit: 10, page: 1 });
    (query.getHATEOASForAllItems as jest.Mock).mockReturnValue({ next: null, prev: null });

    const response = await request(app).get('/api/v1/users').expect(200);

    // Assertions
    expect(response.body).toHaveProperty('data', mockUsers);
    expect(response.body).toHaveProperty('pagination', { totalItems: 2, limit: 10, page: 1 });
    expect(response.body).toHaveProperty('links', { next: null, prev: null });
  });
});

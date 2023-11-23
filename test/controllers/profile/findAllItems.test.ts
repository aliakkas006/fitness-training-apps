import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import findAllItems from '../../../src/api/v1/profile/controllers/findAllItems';
import profileService from '../../../src/lib/profile';
import query from '../../../src/utils/query';

// Mock the profileService and query modules
jest.mock('../../../src/lib/profile', () => ({
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
app.get('/api/v1/profiles', findAllItems);

describe('Find all profiles Controller', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  it('should return a list of all profiles with status 200', async () => {
    const mockProfiles = [
      {
        id: 'profile1',
        firstName: 'Ali',
        lastName: 'Akkas',
        email: 'akkas@example.com',
        avatar: 'profile1.jpg',
        age: 23,
        height: 6,
        weight: 60,
        fitnessLevel: 'beginner',
        goal: 'build_muscle',
        user: 'user123',
      },
      {
        id: 'profile2',
        firstName: 'Rasel',
        lastName: 'Hossain',
        email: 'rasel@example.com',
        avatar: 'profile2.jpg',
        age: 24,
        height: 6,
        weight: 60,
        fitnessLevel: 'beginner',
        goal: 'build_muscle',
        user: 'user258',
      },
    ];

    (profileService.findAllItems as jest.Mock).mockResolvedValue(mockProfiles);

    (query.getTransformedItems as jest.Mock).mockReturnValue(mockProfiles);
    (query.getPagination as jest.Mock).mockReturnValue({ totalItems: 2, limit: 10, page: 1 });
    (query.getHATEOASForAllItems as jest.Mock).mockReturnValue({ next: null, prev: null });

    const requestQuery = {
      page: '1',
      limit: '10',
      sort_type: 'dsc',
      sort_by: 'updatedAt',
    };

    const response = await request(app).get('/api/v1/profiles').query(requestQuery).expect(200);

    // Assertions
    expect(response.body).toHaveProperty('data', mockProfiles);
    expect(response.body).toHaveProperty('pagination', { totalItems: 2, limit: 10, page: 1 });
    expect(response.body).toHaveProperty('links', { next: null, prev: null });
  });
});

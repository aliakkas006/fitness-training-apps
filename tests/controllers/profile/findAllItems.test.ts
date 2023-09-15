import request from 'supertest';
import express from 'express';
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

// Create an Express app and use the findAllItems controller
const app = express();
app.use(express.json());
app.get('/api/v1/profiles', findAllItems);

describe('Find all profiles Controller', () => {
  it('should return a list of all profiles with status 200', async () => {
    const mockProfiles = [
      {
        id: 'profile1',
        firstName: 'Ali',
        lastName: 'Akkas',
        email: 'akkas@example.com',
        profilePic: 'profile1.jpg',
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
        profilePic: 'profile2.jpg',
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

    const response = await request(app).get('/api/v1/profiles').expect(200);

    // Assertions
    expect(response.body).toHaveProperty('data', mockProfiles);
    expect(response.body).toHaveProperty('pagination', { totalItems: 2, limit: 10, page: 1 });
    expect(response.body).toHaveProperty('links', { next: null, prev: null });
  });
});

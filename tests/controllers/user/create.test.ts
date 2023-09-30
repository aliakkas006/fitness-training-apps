import express from 'express';
import request from 'supertest';
import { connectTestDB, disconnectTestDB } from '../../setup-db';
import createController from '../../../src/api/v1/user/controllers/create';
import User from '../../../src/model/User';

// Create an Express app and use the controller
const app = express();
app.use(express.json());
app.post('/api/v1/users', createController);

describe('Create User Controller', () => {
  beforeAll(async () => {
    await await connectTestDB();
  });

  afterAll(async () => {
    await await disconnectTestDB();
  });

  it('should create a new user', async () => {
    const requestBody = {
      name: 'Ali Akkas',
      email: 'ali@gmil.com',
      password: 'pass123',
      role: 'user',
      status: 'pending',
    };

    const response = await request(app).post('/api/v1/users').send(requestBody).expect(201);

    // Add assertions here to check the response body, database state, etc.
    expect(response.body.message).toBe('User Created Successfully');
    expect(response.body.data.name).toBe(requestBody.name);
    expect(response.body.data.email).toBe(requestBody.email);

    // Check the database state using userService or any database library you're using.
    const createdUser: any = await User.findOne({ email: requestBody.email });
    expect(createdUser).toBeDefined();
    expect(createdUser.name).toBe(requestBody.name);
  });
});

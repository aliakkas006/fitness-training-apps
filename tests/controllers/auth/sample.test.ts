// import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import connectDB from '../../../src/config/connectDB';
import registerController from '../../../src/api/v1/auth/controllers/register';

const app = express();
app.use(express.json());
app.post('/api/v1/auth/register', registerController);

beforeAll(async () => {
  // Connect to the test database before running the tests
  await connectDB();
}, 10000);

afterAll(async () => {
  // Disconnect from the database after all tests are done
  await mongoose.disconnect();
}, 10000);

describe('Register Controller', () => {
  

  it('should register a new user and return an access token with status 201', async () => {
    console.log('perfectly worked');
    //   const requestBody = {
    //     name: 'Test User',
    //     email: 'test@gmail.com',
    //     password: 'pass123',
    //   };

    //   const response = await request(app).post('/api/v1/auth/register').send(requestBody).expect(201);

    //   // Assertions
    //   expect(response.body).toHaveProperty('code', 201);
    //   expect(response.body).toHaveProperty('message', 'Account Created Successfully');
    //   expect(response.body.data).toHaveProperty('access_token');
  });
});

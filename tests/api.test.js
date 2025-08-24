const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');

describe('API Endpoints', () => {
  // Before running tests, you might want to connect to a test database
  // beforeAll(async () => {
  //   const testMongoUri = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/secret-santa-test';
  //   await mongoose.connect(testMongoUri);
  // });

  // After all tests, disconnect from the database
  // afterAll(async () => {
  //   await mongoose.connection.close();
  // });

  // Health check route
  describe('GET /health', () => {
    it('should return status 200', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  // More tests would be added here...
});

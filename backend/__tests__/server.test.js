import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

// Mock mongoose.connect to prevent actual DB connections
vi.mock('mongoose', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    connect: vi.fn().mockResolvedValue(true)
  };
});

// Setting NODE_ENV to 'test' so app.listen isn't called
process.env.NODE_ENV = 'test';

describe('Server and Middleware Integration', () => {
  it('should initialize CORS and express JSON parsers correctly', async () => {
    // Making a GET request without hitting a valid backend route to test parsing
    // Sending a payload and checking if the server doesn't crash
    const res = await request(app)
      .get('/some-random-route-that-hits-spa')
      .send({ test: 'data' });
    
    // We expect 200 because the wildcard route catches everything not starting with /api
    expect(res.status).toBe(200);
    // And CORS headers should be present
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('should cleanly resolve unhandled routes via Express 5 catch-all SPA wildcard', async () => {
    const res = await request(app).get('/dashboard/random/path');
    
    // The wildcard app.get('/{*splat}') should catch this and send index.html
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/html/);
  });
  
  it('should block SPA wildcard from intercepting /api endpoints', async () => {
    // Hitting a non-existent /api route should NOT return 200 with index.html
    // It should fall through and return 404 because the wildcard explicitly checks for !req.path.startsWith('/api')
    const res = await request(app).get('/api/invalid-route-123');
    expect(res.status).toBe(404);
  });
});

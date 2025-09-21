const request = require('supertest');
const app = require('../server');

describe('User Service Endpoints', () => {
  let token;

  test('Health check', async () => {
    const res = await request(app).get('/api/users/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Register user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '08123456789'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Login user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Get profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('Update profile', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.firstName).toBe('Updated');
  });
});

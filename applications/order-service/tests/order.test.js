// tests/order.test.js
const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');

// Setup database before tests
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Clean up after tests
afterAll(async () => {
  await sequelize.close();
});

describe('Order Service API', () => {
  let orderId;

  it('Health check should return 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('Should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        userId: 'user-123',
        products: [
          { id: 'prod-1', price: 10, quantity: 2 },
          { id: 'prod-2', price: 5, quantity: 1 }
        ]
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toHaveProperty('id');
    expect(res.body.order.totalPrice).toBe(25);
    orderId = res.body.order.id;
  });

  it('Should get all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
  });

  it('Should get single order by ID', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.order.id).toBe(orderId);
  });

  it('Should update order status', async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}`)
      .send({ status: 'paid' });
    expect(res.statusCode).toBe(200);
    expect(res.body.order.status).toBe('paid');
  });
});

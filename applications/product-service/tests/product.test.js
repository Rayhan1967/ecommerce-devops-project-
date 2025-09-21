const request = require('supertest');
const app = require('../server');

describe('Product Service API', () => {
  let productId;

  test('Create product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test', description: 'Desc', price: 10, category: 'test', stock: 5 });
    expect(res.statusCode).toBe(201);
    productId = res.body.product._id;
  });

  test('Get all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  test('Get single product', async () => {
    const res = await request(app).get(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.product._id).toBe(productId);
  });

  test('Update product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .send({ price: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.product.price).toBe(20);
  });

  test('Delete product', async () => {
    const res = await request(app).delete(`/api/products/${productId}`);
    expect(res.statusCode).toBe(200);
  });
});

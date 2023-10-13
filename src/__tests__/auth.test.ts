import supertest from 'supertest';
import { app } from '../index';
import { generateJwt } from '../controllers/userController';

const baseUrl = '/api/user';

describe('authMiddleware', () => {
  it('should pass with a valid token', async () => {
    const validToken = generateJwt('testuser', 'testpassword', 'user');

    const response = await supertest(app)
      .get(`${baseUrl}/auth`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('should return unauthorized without a token', async () => {
    const response = await supertest(app).get(`${baseUrl}/auth`);

    expect(response.status).toBe(401);
    expect(response.body.error.title).toBe('unauthorized');
  });
});

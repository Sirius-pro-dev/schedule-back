import supertest from 'supertest';
import { app } from '../index';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { testUser } from '../__mocks__/user/user';

const baseUrl = '/api/user';

jest.mock('../models/user');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const mockedUser = User as jest.Mocked<typeof User>;

describe('user', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/user/registration', () => {
    it('should registration user', async () => {
      // @ts-ignore
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(User.prototype, 'save').mockResolvedValue('');

      const response = await supertest(app)
        .post(`${baseUrl}/registration`)
        .send(testUser);

      expect(response.status).toBe(201);
    });

    it('should return a 400 error for missing password', async () => {
      const testUser = {
        name: 'John',
        userName: 'JohnDoe',
        lastName: 'Doe',
        surName: 'Smith',
        role: 'user'
      };

      const response = await supertest(app)
        .post(`${baseUrl}/registration`)
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.error.detail).toBe('Некорректный имя либо пароль');
    });

    it('should return a 400 error for missing username or password', async () => {
      const testUser = {
        name: 'John',
        lastName: 'Doe',
        surName: 'Smith',
        role: 'user'
      };

      const response = await supertest(app)
        .post(`${baseUrl}/registration`)
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.error.detail).toBe('Некорректный имя либо пароль');
    });

    it('should return a 400 error for an existing username', async () => {
      mockedUser.findOne.mockResolvedValue({ userName: 'JohnDoe' });

      const response = await supertest(app)
        .post(`${baseUrl}/registration`)
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.error.detail).toBe(
        'Пользователь с таким именем уже существует'
      );
    });

    it('should return a 503 error', async () => {
      jest.spyOn(mockedUser, 'findOne').mockRejectedValue(new Error('Test error'));

      const response = await supertest(app)
        .post(`${baseUrl}/registration`)
        .send(testUser);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('POST /api/user/login', () => {
    it('should return a 200 status and a token on successful login', async () => {
      const testUser = {
        userName: 'testuser',
        password: 'incorrectpassword'
      };

      const mockUser = {
        userName: 'testuser',
        password: 'hashedPassword',
        role: 'user'
      };

      jest.spyOn(mockedUser, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const response = await supertest(app).post(`${baseUrl}/login`).send(testUser);

      expect(response.status).toBe(200);
    });

    it('should return a 404 status when user is not found', async () => {
      const testUser = {
        userName: 'nonexistentuser',
        password: 'testpassword'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      const response = await supertest(app).post(`${baseUrl}/login`).send(testUser);

      expect(response.status).toBe(404);
      expect(response.body.error.detail).toBe('Пользователь не найден');
    });

    it('should return a 400 status when password is incorrect', async () => {
      const testUser = {
        userName: 'testuser',
        password: 'incorrectpassword'
      };

      const mockUser = {
        userName: 'testuser',
        password: 'hashedPassword',
        role: 'user'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

      const response = await supertest(app).post(`${baseUrl}/login`).send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.error.detail).toBe('Указан неверный пароль');
    });

    it('should return a 503 error', async () => {
      jest.spyOn(mockedUser, 'findOne').mockRejectedValue(new Error('Test error'));

      const response = await supertest(app).post(`${baseUrl}/login`).send(testUser);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });
});

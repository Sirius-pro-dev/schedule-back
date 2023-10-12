import supertest from 'supertest';
import { app } from '../index';
import Group from '../models/group';
import { testGroups } from '../__mocks__/group/groups';
import ApiError from '../error/ApiError';

const baseUrl = '/api/group';

jest.mock('../models/group');

const mockedGroup = Group as jest.Mocked<typeof Group>;

describe('groups', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/group', () => {
    it('should get all groups when there are groups', async () => {
      mockedGroup.find.mockResolvedValue(testGroups);

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(200);
    });

    it('should return a 404 error when there are no groups', async () => {
      jest.spyOn(mockedGroup, 'find').mockResolvedValue([]);

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
    });

    it('should return a 503 error when there are no groups', async () => {
      mockedGroup.find.mockRejectedValue(new Error('some error'));

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('GET /api/group/:name', () => {
    const groupName = testGroups[0].name;
    it('should get a group by name', async () => {
      jest.spyOn(mockedGroup, 'findOne').mockResolvedValue(testGroups);

      const response = await supertest(app).get(`${baseUrl}/${groupName}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testGroups);
    });

    it('should return a 400 error if name is missing', async () => {
      // jest.spyOn(Group, 'findOne').mockResolvedValue(testGroups);
      // const response = await supertest(app).get(baseUrl);
      const response = await supertest(app).get(`${baseUrl}/`);

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
    });

    it('should return a 404 error if group is not found', async () => {
      jest.spyOn(mockedGroup, 'findOne').mockResolvedValue(null);

      const response = await supertest(app).get(`${baseUrl}/group-name`);

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
    });

    it('should return a 503 error if an error occurs', async () => {
      const findOneSpy = jest.spyOn(mockedGroup, 'findOne');
      findOneSpy.mockRejectedValue(new Error('Some error message'));

      const response = await supertest(app).get(`${baseUrl}/${groupName}`);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('POST /api/group/create', () => {
    it('should create a group when all required fields are provided', async () => {
      const testData = {
        name: 'Test Group',
        major: 'Computer Science',
        course: 1,
        studyForm: 'Full-time',
        educationLevel: 'Bachelor',
        users: []
      };

      // @ts-ignore
      jest.spyOn(mockedGroup, 'create').mockResolvedValue(testData);

      const response = await supertest(app).post(`${baseUrl}/create`).send(testData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testData.name);
    });

    it('should return a bad request if not all required fields are provided', async () => {
      const incompleteData = {
        name: 'Incomplete Group',
        major: 'Computer Science'
      };

      const response = await supertest(app)
        .post(`${baseUrl}/create`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
      expect(response.body.error.detail).toBe('Указаны не все поля');
    });

    it('should return a not found error if any user in the list is not found', async () => {
      const testDataWithInvalidUser = {
        name: 'Invalid User Group',
        major: 'Computer Science',
        course: 1,
        studyForm: 'Full-time',
        educationLevel: 'Bachelor',
        users: [{ _id: '6520533a03eb70598ff0ff93' }]
      };

      const response = await supertest(app)
        .post(`${baseUrl}/create`)
        .send(testDataWithInvalidUser);

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
      expect(response.body.error.detail).toBe('Не найден пользователь');
    });

    it('should return a bad gateway error if an error occurs during group creation', async () => {
      jest.spyOn(mockedGroup, 'create').mockRejectedValue(new Error('Test error'));

      const testData = {
        name: 'Error Group',
        major: 'Computer Science',
        course: 1,
        studyForm: 'Full-time',
        educationLevel: 'Bachelor',
        users: ['user1_id', 'user2_id']
      };

      const response = await supertest(app).post(`${baseUrl}/create`).send(testData);

      expect(response.status).toBe(503);
    });
  });

  describe('DELETE /api/group/delete', () => {
    it('should delete a group when name is provided', async () => {
      const testData = {
        name: 'Test Group',
        major: 'Computer Science',
        course: 1,
        studyForm: 'Full-time',
        educationLevel: 'Bachelor',
        users: []
      };

      jest.spyOn(mockedGroup, 'findOneAndDelete').mockResolvedValue(testData);

      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ name: 'Test Group' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Group');
    });

    it('should return a 400 error if name is missing', async () => {
      const response = await supertest(app).delete(`${baseUrl}/delete`).send({});

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
      expect(response.body.error.detail).toBe(
        'Не указано обязательное поле название группы'
      );
    });

    it('should return a 404 error if group is not found', async () => {
      jest.spyOn(mockedGroup, 'findOneAndDelete').mockResolvedValue(null);
      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ name: 'Nonexistent Group' });

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
      expect(response.body.error.detail).toBe('Группа не удалилась, произошла ошибка');
    });

    it('should return a 503 error', async () => {
      jest
        .spyOn(mockedGroup, 'findOneAndDelete')
        .mockRejectedValue(new ApiError(503, 'badGateway', 'groupContoller/deleteGroup'));
      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ name: 'Nonexistent Group' });

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });
});

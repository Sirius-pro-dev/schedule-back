import supertest from 'supertest';
import { app } from '../index';
import Group from '../models/group';
import Schedule from '../models/schedule';
import { testSchedule } from '../__mocks__/schedule/schedule';
import User from '../models/user';

const baseUrl = '/api/schedule';

jest.mock('../models/group');
jest.mock('../models/schedule');
jest.mock('../models/group');

const mockedGroup = Group as jest.Mocked<typeof Group>;
const mockedSchedule = Schedule as jest.Mocked<typeof Schedule>;
const mockedUser = User as jest.Mocked<typeof User>;

describe('schedule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/schedule', () => {
    it('should get all schedule', async () => {
      jest.spyOn(mockedSchedule, 'find').mockResolvedValue(testSchedule);

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testSchedule);
    });

    it('should return a 404 error', async () => {
      jest.spyOn(mockedSchedule, 'find').mockResolvedValue([]);

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(404);
      expect(response.body.error.detail).toBe('расписания не найдено либо не существует');
    });

    it('should return a 503 error when there are no schedule', async () => {
      mockedSchedule.find.mockRejectedValue(new Error('some error'));

      const response = await supertest(app).get(baseUrl);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('GET /api/schedule/:id', () => {
    it('should get all schedule', async () => {
      jest.spyOn(mockedSchedule, 'findOne').mockResolvedValue(testSchedule);

      const response = await supertest(app).get(`${baseUrl}/65206814f7fa1690dbac9126`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testSchedule);
    });

    it('should return a 400 error if name is missing', async () => {
      const response = await supertest(app).get(`${baseUrl}/`);

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
    });

    it('should return a 404 error', async () => {
      jest.spyOn(mockedSchedule, 'findOne').mockResolvedValue(null);

      const response = await supertest(app).get(`${baseUrl}/some-id`);

      expect(response.status).toBe(404);
      expect(response.body.error.detail).toBe('расписания не найдено либо не существует');
    });

    it('should return a 503 error when there are no schedule', async () => {
      const findOneSpy = jest.spyOn(mockedSchedule, 'findOne');
      findOneSpy.mockRejectedValue(new Error('Some error message'));

      const response = await supertest(app).get(`${baseUrl}/some-id`);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('POST /api/schedule/create', () => {
    it('should create a schedule when all required fields are provided', async () => {
      const dataSchedule = {
        _id: 'scheduleId',
        date: '2023-10-06T20:03:32.854Z',
        time: 'Fri Oct 06 2023 23:03:32 GMT+0300 (Москва, стандартное время)',
        disciplineName: 'базы данных',
        classType: 'очная',
        users: ['user1', 'user2'],
        group: { _id: 'groupId', name: 'Group1' },
        locationAddress: 'лицей',
        classRoom: '203'
      };

      jest
        .spyOn(mockedUser, 'find')
        .mockResolvedValue([{ _id: 'user1' }, { _id: 'user2' }]);

      jest
        .spyOn(mockedGroup, 'findOne')
        .mockResolvedValue({ _id: 'groupId', name: 'Group1' });

      // @ts-ignore
      jest.spyOn(mockedSchedule, 'create').mockResolvedValue(dataSchedule);

      const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(dataSchedule);
    });

    it('should return a bad request if not all required fields are provided', async () => {
      const dataSchedule = {
        _id: 'scheduleId',
        date: '2023-10-06T20:03:32.854Z',
        time: 'Fri Oct 06 2023 23:03:32 GMT+0300 (Москва, стандартное время)',
        disciplineName: 'базы данных',
        classType: 'очная',
        locationAddress: 'лицей',
        classRoom: '203'
      };

      // @ts-ignore
      jest.spyOn(mockedSchedule, 'create').mockResolvedValue(dataSchedule);

      const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
      expect(response.body.error.detail).toBe('Указаны не все поля');
    });

    it('should return a not found error if any user in the list is not found', async () => {
      const dataSchedule = {
        _id: 'scheduleId',
        date: '2023-10-06T20:03:32.854Z',
        time: 'Fri Oct 06 2023 23:03:32 GMT+0300 (Москва, стандартное время)',
        disciplineName: 'базы данных',
        classType: 'очная',
        users: ['user1', 'user2'],
        group: { _id: 'groupId', name: 'Group1' },
        locationAddress: 'лицей',
        classRoom: '203'
      };

      jest.spyOn(mockedUser, 'find').mockResolvedValue([]);

      jest
        .spyOn(mockedGroup, 'findOne')
        .mockResolvedValue({ _id: 'groupId', name: 'Group1' });

      // @ts-ignore
      jest.spyOn(mockedSchedule, 'create').mockResolvedValue(dataSchedule);

      const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
      expect(response.body.error.detail).toBe('Не найден пользователь');
    });

    it('should return a not found error if any group in the list is not found', async () => {
      const dataSchedule = {
        _id: 'scheduleId',
        date: '2023-10-06T20:03:32.854Z',
        time: 'Fri Oct 06 2023 23:03:32 GMT+0300 (Москва, стандартное время)',
        disciplineName: 'базы данных',
        classType: 'очная',
        users: ['user1', 'user2'],
        group: { _id: 'groupId', name: 'Group1' },
        locationAddress: 'лицей',
        classRoom: '203'
      };

      jest
        .spyOn(mockedUser, 'find')
        .mockResolvedValue([{ _id: 'user1' }, { _id: 'user2' }]);

      jest.spyOn(mockedGroup, 'findOne').mockResolvedValue(null);

      // @ts-ignore
      jest.spyOn(mockedSchedule, 'create').mockResolvedValue(dataSchedule);

      const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
      expect(response.body.error.detail).toBe('Не найдена группа');
    });

    // it('should return a 400 error a schedule when all required fields are provided', async () => {
    //   const dataSchedule = {
    //     _id: 1,
    //     date: 5,
    //     time: 4,
    //     disciplineName: 'базы данных',
    //     classType: 'очная',
    //     users: ['user1', 'user2'],
    //     group: { _id: 'groupId', name: 'Group1' },
    //     locationAddress: 'лицей',
    //     classRoom: 203
    //   };
    //
    //   jest
    //       .spyOn(mockedUser, 'find')
    //       .mockResolvedValue([{ _id: 'user1' }, { _id: 'user2' }]);
    //
    //   jest
    //       .spyOn(mockedGroup, 'findOne')
    //       .mockResolvedValue({ _id: 'groupId', name: 'Group1' });
    //
    //   // @ts-ignore
    //   jest.spyOn(mockedSchedule, 'create').mockResolvedValue(dataSchedule);
    //
    //   const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);
    //
    //   expect(response.status).toBe(404);
    //   expect(response.body.error.title).toBe('notFound');
    //   expect(response.body.error.detail).toBe('расписание не создалось');
    // });

    it('should return a bad gateway error if an error occurs during group creation', async () => {
      const dataSchedule = {
        _id: 'scheduleId',
        date: '2023-10-06T20:03:32.854Z',
        time: 'Fri Oct 06 2023 23:03:32 GMT+0300 (Москва, стандартное время)',
        disciplineName: 'базы данных',
        classType: 'очная',
        users: ['user1', 'user2'],
        group: { _id: 'groupId', name: 'Group1' },
        locationAddress: 'лицей',
        classRoom: '203'
      };

      jest
        .spyOn(mockedUser, 'find')
        .mockResolvedValue([{ _id: 'user1' }, { _id: 'user2' }]);

      jest
        .spyOn(mockedGroup, 'findOne')
        .mockResolvedValue({ _id: 'groupId', name: 'Group1' });

      jest.spyOn(mockedSchedule, 'create').mockRejectedValue(new Error('Test error'));

      const response = await supertest(app).post(`${baseUrl}/create`).send(dataSchedule);

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });

  describe('DELETE /api/schedule/delete', () => {
    it('should delete a schedule when id is provided', async () => {
      jest.spyOn(mockedSchedule, 'findOneAndDelete').mockResolvedValue(testSchedule);

      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ id: '65206814f7fa1690dbac9126' });

      expect(response.status).toBe(200);
    });

    it('should return a 400 error if id is missing', async () => {
      const response = await supertest(app).delete(`${baseUrl}/delete`).send({});

      expect(response.status).toBe(400);
      expect(response.body.error.title).toBe('badRequest');
      expect(response.body.error.detail).toBe('Не указан id расписания');
    });

    it('should return a 404 error if schedule is not found', async () => {
      jest.spyOn(mockedSchedule, 'findOneAndDelete').mockResolvedValue(null);
      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ id: 'some-id' });

      expect(response.status).toBe(404);
      expect(response.body.error.title).toBe('notFound');
      expect(response.body.error.detail).toBe(
        'расписание не удалилось, произошла ошибка. Проверте правильность написания идентификатора'
      );
    });

    it('should return a 503 error', async () => {
      jest
        .spyOn(mockedSchedule, 'findOneAndDelete')
        .mockRejectedValue(new Error('Test error'));
      const response = await supertest(app)
        .delete(`${baseUrl}/delete`)
        .send({ id: 'some-id' });

      expect(response.status).toBe(503);
      expect(response.body.error.title).toBe('badGateway');
    });
  });
});

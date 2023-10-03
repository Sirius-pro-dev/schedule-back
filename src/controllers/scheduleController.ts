import ApiError from '../error/ApiError';
const getStudentScheduleAll = require('../api/schedules/getStudentScheduleAll.json');
const getStudentScheduleOne = require('../api/schedules/getStudentScheduleOne.json');

class ScheduleController {
  static async getAll(req: any, res: any, next: any) {
    try {
      // if (response.length === 0) {
      //     next(ApiError.badRequest('id расписания не найдено либо не существует'));
      //     return;
      // }
      return res.status(200).json(getStudentScheduleAll);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/getAll'));
    }
  }

  static async getOne(req: any, res: any, next: any) {
    try {
      const { id } = req.query;

      if (!id) {
        next(ApiError.badRequest('Не указан id расписания', 'scheduleController/getOne'));
        return;
      }

      // if (response.length === 0) {
      //     next(ApiError.notFound('id расписания не найдено либо не существует'));
      //     return;
      // }

      return res.status(200).json(getStudentScheduleOne);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/getOne'));
    }
  }

  static async createSchedule(req: any, res: any, next: any) {
    try {
      const {
        date,
        time,
        disciplineName,
        classType,
        users,
        group,
        locationAddress,
        classRoom
      } = req.body;
      const userMockId = '211112';
      let flagUser = false;

      if (
        !date ||
        !time ||
        !disciplineName ||
        !classType ||
        !users ||
        !group ||
        !locationAddress ||
        !classRoom
      ) {
        next(
          ApiError.badRequest('Указаны не все поля', 'scheduleController/createSchedule')
        );
        return;
      }

      users.forEach((user: any) => {
        if (user.userId !== userMockId) {
          flagUser = true;
        }
      });

      // if (group.length === 0) {
      //     next(ApiError.notFound('Не найдена группа'));
      //     return;
      // }

      if (flagUser) {
        next(
          ApiError.notFound('Не найден пользователь', 'scheduleController/createSchedule')
        );
        return;
      }

      return res.status(201).json(getStudentScheduleOne);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/createSchedule'));
    }
  }

  static async deleteSchedule(req: any, res: any, next: any) {
    try {
      const { id } = req.body;

      if (!id) {
        next(
          ApiError.badRequest(
            'Не указан id расписания',
            'scheduleController/deleteSchedule'
          )
        );
        return;
      }

      // if (response.length === 0) {
      //     next(ApiError.notFound('id расписания не найдено либо не существует'));
      //     return;
      // }

      return res.status(200).json({ id: id });
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/deleteSchedule'));
    }
  }
}

export default ScheduleController;

import Schedule from '../models/schedule';
import User from '../models/user';
import Group from '../models/group';
import ApiError from '../error/ApiError';
import { convertResponse } from '../utils/index';

class ScheduleController {
  static async getAll(req: any, res: any, next: any) {
    try {
      const resultData = await Schedule.find({});

      if (resultData.length === 0) {
        next(
          ApiError.notFound(
            'расписания не найдено либо не существует',
            'scheduleController/getOne'
          )
        );

        return;
      }

      const response = await convertResponse(resultData);

      return res.status(200).json(response);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/getAll'));
    }
  }

  static async getOne(req: any, res: any, next: any) {
    try {
      const { id } = req.params;

      if (!id) {
        next(ApiError.badRequest('Не указан id расписания', 'scheduleController/getOne'));
        return;
      }

      const resultData = await Schedule.findOne({ _id: id });
      if (!resultData) {
        next(
          ApiError.notFound(
            'расписания не найдено либо не существует',
            'scheduleController/getOne'
          )
        );
        return;
      }

      const response = await convertResponse(resultData);

      return res.status(200).json(response);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/getOne'));
    }
  }

  static async createSchedule(req: any, res: any, next: any) {
    try {
      const { disciplineName, classType, users, group, locationAddress, classRoom } =
        req.body;

      if (
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

      const userData = await User.find({ _id: { $in: users } });
      if (userData.length !== users.length) {
        next(
          ApiError.notFound('Не найден пользователь', 'scheduleController/createSchedule')
        );
        return;
      }

      const groupData = await Group.findOne({ name: group });
      if (!groupData) {
        next(ApiError.notFound('Не найдена группа', 'scheduleController/createSchedule'));
        return;
      }

      const date = new Date();
      const time = new Date();

      const resultData = await Schedule.create({
        date: date,
        time: time,
        disciplineName: disciplineName,
        classType: classType,
        users: userData,
        group: groupData,
        locationAddress: locationAddress,
        classRoom: classRoom
      });

      if (!resultData) {
        next(
          ApiError.notFound(
            'расписание не создалось',
            'scheduleController/createSchedule'
          )
        );
        return;
      }

      return res.status(201).json(resultData);
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

      const resultData = await Schedule.findOneAndDelete({ _id: id });

      if (!resultData) {
        next(
          ApiError.notFound(
            'расписание не удалилось, произошла ошибка. Проверте правильность написания идентификатора',
            'scheduleController/deleteSchedule'
          )
        );
        return;
      }

      return res.status(200).json(resultData);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/deleteSchedule'));
    }
  }
}

export default ScheduleController;

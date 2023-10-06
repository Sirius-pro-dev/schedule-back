import ApiError from '../error/ApiError';
import Group from '../models/group';

const getGroup = require('../api/groups/getGroup.json');
const getAllGroup = require('../api/groups/getAllGroup.json');

class GroupController {
  static async getAll(req: any, res: any, next: any) {
    try {
      const response = await Group.find({});

      if (response.length === 0) {
        next(ApiError.notFound('Не найдены группы', 'groupContoller/getAll'));
        return;
      }

      res.status(200).json(getAllGroup);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/getAll'));
    }
  }

  static async getOne(req: any, res: any, next: any) {
    try {
      const { name } = req.query;

      if (!name) {
        next(
          ApiError.badRequest(
            'Не указано обязательное поле название группы',
            'groupContoller/getOne'
          )
        );
        return;
      }

      // if (response.length === 0) {
      //     next(ApiError.notFound('Название группы не найдена либо не существует'));
      //     return;
      // }

      res.status(200).json(getGroup);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/getOne'));
    }
  }

  static async createGroup(req: any, res: any, next: any) {
    try {
      const { name, major, course, studyForm, educationLevel, users } = req.body;
      const userMockId = '211112';
      let flagUser = false;

      if (!name || !major || !course || !studyForm || !educationLevel || !users) {
        next(ApiError.badRequest('Указаны не все поля', 'groupContoller/createGroup'));
        return;
      }

      users.forEach((user: any) => {
        if (user.userId !== userMockId) {
          flagUser = true;
        }
      });

      if (flagUser) {
        next(ApiError.notFound('Не найден юзер', 'groupContoller/createGroup'));
        return;
      }

      return res.status(201).json(getGroup);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/createGroup'));
    }
  }

  static async deleteGroup(req: any, res: any, next: any) {
    try {
      const { name } = req.body;

      if (!name) {
        next(
          ApiError.badRequest(
            'Не указано обязательное поле название группы',
            'groupContoller/deleteGroup'
          )
        );
        return;
      }

      // if (response.length === 0) {
      //     next(ApiError.notFound('Название группы не найдена либо не существует'));
      //     return;
      // }

      return res.status(200).json({ name: name });
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/deleteGroup'));
    }
  }
}

export default GroupController;

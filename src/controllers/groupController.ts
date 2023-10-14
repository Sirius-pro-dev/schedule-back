import ApiError from '../error/ApiError';
import Group from '../models/group';
import User from '../models/user';
import { convertResponse } from '../utils';

class GroupController {
  static async getAll(req: any, res: any, next: any) {
    try {
      const groups: any = await Group.find({});

      if (groups.length === 0) {
        next(ApiError.notFound('Не найдены группы', 'groupContoller/getAll'));
        return;
      }

      const response = await convertResponse(groups);

      res.status(200).json(response);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/getAll'));
    }
  }

  static async getOne(req: any, res: any, next: any) {
    try {
      const { name } = req.params;

      if (!name) {
        next(
          ApiError.badRequest(
            'Не указано обязательное поле название группы',
            'groupContoller/getOne'
          )
        );

        return;
      }

      const group: any = await Group.findOne({ name: name });

      if (!group) {
        next(
          ApiError.notFound(
            'Название группы не найдена либо не существует',
            'groupContoller/getOne'
          )
        );

        return;
      }

      const response = await convertResponse(group);

      res.status(200).json(response);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/getOne'));
    }
  }

  static async createGroup(req: any, res: any, next: any) {
    try {
      const { name, major, course, studyForm, educationLevel, users } = req.body;

      if (!name || !major || !course || !studyForm || !educationLevel || !users) {
        next(ApiError.badRequest('Указаны не все поля', 'groupContoller/createGroup'));
        return;
      }

      const userData = await User.find({ userName: { $in: users } });
      if (userData.length !== users.length) {
        next(ApiError.notFound('Не найден пользователь', 'groupContoller/createGroup'));
        return;
      }

      const group = await Group.create({
        name: name,
        major: major,
        course: course,
        studyForm: studyForm,
        educationLevel: educationLevel,
        users: userData
      });

      return res.status(201).json(group);
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

      const resultData = await Group.findOneAndDelete({ name: name });

      if (!resultData) {
        next(
          ApiError.notFound(
            'Группа не удалилась, произошла ошибка',
            'groupContoller/deleteGroup'
          )
        );
        return;
      }

      return res.status(200).json(resultData);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'groupContoller/deleteGroup'));
    }
  }
}

export default GroupController;

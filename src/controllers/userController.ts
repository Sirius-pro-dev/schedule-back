import ApiError from '../error/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Group from '../models/group';

export const generateJwt = (userName: string, password: string, role: string) => {
  return jwt.sign({ userName, password, role }, String(process.env.SECRET_KEY), {
    expiresIn: '24h'
  });
};

class UserController {
  static async registration(req: any, res: any, next: any) {
    const { userName, password, name, lastName, surName, role } = req.body;
    try {
      if (!userName || !password) {
        return next(
          ApiError.badRequest(
            'Некорректный имя либо пароль',
            'userController/registration'
          )
        );
      }

      const candidate = await User.findOne({ userName: userName });
      if (candidate) {
        return next(
          ApiError.badRequest(
            'Пользователь с таким именем уже существует',
            'userController/registration'
          )
        );
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = new User({
        userName: userName,
        password: hashPassword,
        name: name,
        lastName: lastName,
        surName: surName,
        role: role
      });
      await user.save();
      const token = generateJwt(userName, password, role);

      return res.status(201).json({ token });
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'userController/registration'));
    }
  }

  static async getTeacherOrGroup (req: any, res: any, next: any) {
    try {
      const { tab } = req.query;
      if (tab !== 'преподаватель' && tab !== 'группа') {
        return next(ApiError.badRequest('Указаны не существующие типы', 'userController/getTeacherOrGroup'));
      }

      switch (tab) {
        case 'преподаватель': 
          const users = await User.find({ role: tab });
          if (users.length === 0) {
            return next(ApiError.notFound('Пользователи не найдены', 'userController/getTeacherOrGroup'));
          }
          return res.status(200).json(users);
        case 'группа':
          const group = await Group.find({});
          if (group.length === 0) {
            return next(ApiError.notFound('Группы не найдены', 'userController/getTeacherOrGroup'));
          }
          return res.status(200).json(group);
      }
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'userController/getTeacherOrGroup'));
    }
  }

  static async login(req: any, res: any, next: any) {
    const { userName, password } = req.body;
    try {
      const user = await User.findOne({ userName: userName });
      if (!user) {
        return next(ApiError.notFound('Пользователь не найден', 'userController/login'));
      }

      const comparePassword = bcrypt.compareSync(password, user.password as any);
      if (!comparePassword) {
        return next(
          ApiError.badRequest('Указан неверный пароль', 'userController/login')
        );
      }

      const token = generateJwt(userName, password, user.role as any);

      return res.status(200).json({ token });
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'userController/login'));
    }
  }

  static async check(req: any, res: any) {
    const token = generateJwt(req.user.userName, req.user.password, req.user.role);
    return res.status(200).json({ token });
  }
}

export default UserController;

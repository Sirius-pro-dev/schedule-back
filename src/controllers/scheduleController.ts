import Schedule from '../models/schedule';
import User from '../models/user';
import Group from '../models/group';
import ApiError from '../error/ApiError';
import { convertResponse, formatTeacherName, getDayName, getWeekRange, isValidDate, isValidTimeRange} from '../utils/index';

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

  static async getWeek(req: any, res: any, next: any) {
    try {
      const { week } = req.params;

      const { startDate, endDate, currentYear, currentMonth } = getWeekRange(parseInt(week, 10));

      const getWeekResult = await Schedule.find({
          date: { $gte: startDate, $lte: endDate }
      });

      if (getWeekResult.length === 0) {
        next(
          ApiError.notFound(
            'расписания не найдено либо не существует',
            'scheduleController/getWeek'
          )
        );
        return;
      }

      const convertData = await convertResponse(getWeekResult);

      const response: any = {
        weekData: {
            month: currentMonth,
            year: currentYear,
            week: week
        },
    };

    convertData.forEach((schedule: any) => {
        const dayOfWeek = schedule.date.getDay();

        if (!response[dayOfWeek]) {
            response[dayOfWeek] = {
                date: schedule.date.getDate().toString(),
                day: getDayName(dayOfWeek),
                lessons: []
            };
        }

        response[dayOfWeek].lessons.push({
            time: schedule.time,
            name: schedule.disciplineName,
            classType: schedule.classType,
            placeActivity: schedule.locationAddress,
            teacher: formatTeacherName(schedule.users[0])
        });
    });

    Object.values(response).forEach((day: any) => {
      if (!day.date) {
        return;
      }
      day.lessons.sort((a: any, b: any) => {
          const timeA: any = a.time.split(":")[0];
          const timeB: any = b.time.split(":")[0];
          return timeA - timeB;
      });
    });

      return res.status(200).json(response);
    } catch (e: any) {
      next(ApiError.badGateway(e.message, 'scheduleController/getWeek'));
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
      const { date, time, disciplineName, classType, teacher, users, group, locationAddress, classRoom } =
        req.body;

      if (
        !date ||
        !time ||
        !disciplineName ||
        !classType ||
        !teacher ||
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

      const teacherData = await User.findOne({ userName: { $in: teacher }, role: { $in: "преподаватель" }});
      if (!teacherData) {
        next(
          ApiError.notFound('Не найден преподователь', 'scheduleController/createSchedule')
        );
        return;
      }

      const userData = await User.find({ userName: { $in: users } });
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

      if (!isValidDate(date)) {
        next(ApiError.badRequest('Дата не соответсвует формату "yyyy-mm-dd"', 'scheduleController/createSchedule'));
      }

      if (!isValidTimeRange(time)) {
        next(ApiError.badRequest('Время не соответсвует формату "hh:mm-hh:mm" с обязательным диапозоном в 1ч 30мин', 'scheduleController/createSchedule'));
      }

      const resultData = await Schedule.create({
        date: date,
        time: time,
        disciplineName: disciplineName,
        classType: classType,
        teacher: teacherData,
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

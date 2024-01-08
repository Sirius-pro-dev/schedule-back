import User from '../models/user';
import Group from '../models/group';

export const getTeacherData = async (teacher: any) => {
  return await User.findOne({ _id: { $in: teacher } });
};

export const getUsersData = async (usersArray: any) => {
  return await User.find({ _id: { $in: usersArray } });
};

export const getGroupData = async (groupId: any) => {
  return await Group.findOne({ _id: groupId });
};

export const convertResponse = async (data: any) => {
  if (Array.isArray(data)) {
    for (const item of data) {
      if (item.users) {
        const usersData = await getUsersData(
            item.users.map((userId: any) => userId.toString())
        );
        item.users = usersData;
      }
      if (item.teacher) {
        const teacherData = await getTeacherData(item.teacher.toString());
        item.teacher = teacherData;
      }

      if (item.group) {
        const groupData = await getGroupData(item.group.toString());
        item.group = groupData;
      }
    }
  } else {
    if (data.users) {
      const usersData = await getUsersData(
          data.users.map((userId: any) => userId.toString())
      );
      data.users = usersData;
    }
    if (data.teacher) {
      const teacherData = await getTeacherData(data.teacher.toString());
      data.teacher = teacherData;
    }

    if (data.group) {
      const groupData = await getGroupData(data.group.toString());
      data.group = groupData;
    }
  }
  return data;
};

export const isValidTimeRange = (timeRange: string) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(timeRange)) {
    return false;
  }

  const [startHour, startMinute, endHour, endMinute] = (
    timeRange.match(/\d+/g) as any
  ).map(Number);

  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  return endTimeInMinutes - startTimeInMinutes === 90;
};

export const isValidDate = (date: string) => {
  const checkValidDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!checkValidDateRegex.test(date)) {
    return false;
  }

  return true;
};

export const getWeekRange = (week: number) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('ru-RU', { month: 'long' });
  const firstDayOfYear = new Date(currentYear, 0, 1);
  const daysToFirstSunday = 0 - firstDayOfYear.getDay();

  const startDate = new Date(currentYear, 0, 2 + daysToFirstSunday + (week - 1) * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  return { startDate, endDate, currentYear: currentYear.toString(), currentMonth };
};

export const getDayName = (dayOfWeek: any) => {
  const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  return daysOfWeek[dayOfWeek];
};

export const formatTeacherName = (user: any) => {
  return `${user.lastName} ${user.name} ${user.surName}`;
};

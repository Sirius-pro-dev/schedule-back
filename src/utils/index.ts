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
      const usersData = await getUsersData(
        item.users.map((userId: any) => userId.toString())
      );
      item.users = usersData;

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
    const usersData = await getUsersData(
      data.users.map((userId: any) => userId.toString())
    );
    data.users = usersData;

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

  const [startHour, startMinute, endHour, endMinute] = (timeRange.match(/\d+/g) as any).map(Number);

  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

  return endTimeInMinutes - startTimeInMinutes === 90;
}

export const isValidDate = (date: string) => {
  const checkValidDateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!checkValidDateRegex.test(date)) {
    return false;
  }

  return true;
}

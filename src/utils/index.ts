import User from '../models/user';
import Group from '../models/group';
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

    if (data.group) {
      const groupData = await getGroupData(data.group.toString());
      data.group = groupData;
    }
  }

  return data;
};

// export const processUsers = async

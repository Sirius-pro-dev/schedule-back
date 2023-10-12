import { getUsersData, getGroupData, convertResponse } from '../utils';
import User from '../models/user';
import Group from '../models/group';

jest.mock('../models/user', () => ({
  find: jest.fn()
}));

jest.mock('../models/group', () => ({
  findOne: jest.fn()
}));

const mockedGroup = Group as jest.Mocked<typeof Group>;
const mockedUser = User as jest.Mocked<typeof User>;

describe('getUsersData', () => {
  it('should call User.find with the correct parameters', async () => {
    const userIds = ['1', '2', '3'];
    await getUsersData(userIds);
    expect(User.find).toHaveBeenCalledWith({ _id: { $in: userIds } });
  });
});

describe('getGroupData', () => {
  it('should call Group.findOne with the correct parameter', async () => {
    const groupId = '123';
    await getGroupData(groupId);
    expect(Group.findOne).toHaveBeenCalledWith({ _id: groupId });
  });
});

describe('convertResponse', () => {
  it('should convert data for a single item', async () => {
    const data = { users: ['1', '2'], group: '123' };

    mockedUser.find.mockResolvedValueOnce(['User1', 'User2']);
    mockedGroup.findOne.mockResolvedValueOnce('Group123');

    const result = await convertResponse(data);

    expect(result).toEqual({ users: ['User1', 'User2'], group: 'Group123' });
  });
});

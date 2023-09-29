import ApiError from '../error/ApiError';
import Group from '../models/group';



class GroupController {
    static async getAll(req: any, res: any, next: any) {
        try {

            const response = await Group.find({});

            if (response.length === 0) {
                next(ApiError.badRequest('Не найдено'));
                return;
            }
            
            return res.status(200).json(response);
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }

    static async createGroup(req: any, res: any, next: any) {
        try {
            const {name, major, course, studyForm, educationLevel, users} = req.body;
            const userMockId = '211112';
            let flagUser = false;

            if (!name || !major || !course || !studyForm || !educationLevel || !users) {
                next(ApiError.badRequest('Указаны не все поля'));
                return;
            }

            users.forEach((user: any) => {
                if (user.userId !== userMockId) {
                    flagUser = true;
                }
            })

            if (flagUser) {
                next(ApiError.badRequest('Не найден юзер'));
                return;
            }

            return res.status(201).json({});
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }
}

export default GroupController;

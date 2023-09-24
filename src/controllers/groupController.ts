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

}

export default GroupController;

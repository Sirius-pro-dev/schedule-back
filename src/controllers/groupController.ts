import ApiError from '../error/ApiError';
const success = require('../api/group/success.json');
const error =require('../api/group/error.json');



class GroupController {
    static async getAll(req: any, res: any, next: any) {
        try {

            if (error.error.status === 404) {
                next(ApiError.badRequest(error.error.statusText));
                return;
            }
            
            return res.json(success);
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }

}

export default GroupController;

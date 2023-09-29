import ApiError from '../error/ApiError';
export const getStudentScheduleAll = require('../api/schedules/getStudentScheduleAll.json');
export const getStudentScheduleOne = require('../api/schedules/getStudentScheduleOne.json');



class ScheduleController {
    static async getAll(req: any, res: any, next: any) {
        try {

            return res.status(200).json(getStudentScheduleAll);
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }

    static async getOne(req: any, res: any, next: any) {
        try {
            
            return res.status(200).json(getStudentScheduleOne);
        } catch (e: any) {
            next(ApiError.badGateway(e.message))
        }
    }
}

export default ScheduleController;

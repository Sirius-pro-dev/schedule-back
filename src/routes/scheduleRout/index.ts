import Router from 'express';
import ScheduleController from '../../controllers/scheduleController';

export const scheduleRouter = Router();

scheduleRouter.get('/', ScheduleController.getAll);
scheduleRouter.post('/:id', ScheduleController.getOne);
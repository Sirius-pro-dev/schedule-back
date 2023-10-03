import Router from 'express';
import ScheduleController from '../../controllers/scheduleController';

export const scheduleRouter = Router();

scheduleRouter.get('/', ScheduleController.getAll);
scheduleRouter.get('/:id', ScheduleController.getOne);
scheduleRouter.get('/create', ScheduleController.createSchedule);
scheduleRouter.get('/delete ', ScheduleController.deleteSchedule);

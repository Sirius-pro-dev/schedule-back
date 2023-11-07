import Router from 'express';
import ScheduleController from '../../controllers/scheduleController';

export const scheduleRouter = Router();

scheduleRouter.get('/', ScheduleController.getAll);
scheduleRouter.get('/week', ScheduleController.getWeek);
scheduleRouter.get('/:id', ScheduleController.getOne);
scheduleRouter.post('/create', ScheduleController.createSchedule);
scheduleRouter.delete('/delete', ScheduleController.deleteSchedule);

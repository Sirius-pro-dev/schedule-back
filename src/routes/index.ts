import Router from 'express';
import { groupRouter } from './groupRout';
import { userRouter } from './userRout';
import { scheduleRouter } from './scheduleRout/index';

export const router = Router();

router.use('/group', groupRouter);
router.use('/user', userRouter);
router.use('/schedule', scheduleRouter);

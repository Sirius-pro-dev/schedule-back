import Router from 'express';
import {groupRouter} from './groupRout/index';
import {userRouter} from './userRout/index';

export const router =  Router();

router.use('/group', groupRouter);
router.use('/user', userRouter);

import Router from 'express';
import {tableRouter} from './tableRout/index';
import {groupRouter} from './groupRout/index';

export const router =  Router();

router.use('/table', tableRouter);
router.use('/group', groupRouter);

import Router from 'express';
import tableController from '../../controllers/tableController';

export const tableRouter = Router();

tableRouter.get('/', tableController.getAll);


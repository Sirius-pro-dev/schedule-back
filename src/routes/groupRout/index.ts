import Router from 'express';
import groupController from '../../controllers/groupController';

export const groupRouter = Router();

groupRouter.get('/', groupController.getAll);
groupRouter.get('/:name', groupController.getOne);
groupRouter.post('/create', groupController.createGroup);
groupRouter.delete('/delete', groupController.deleteGroup);

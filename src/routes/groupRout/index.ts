import Router from 'express';
import groupController from '../../controllers/groupController';

export const groupRouter = Router();

groupRouter.get('/', groupController.getAll);
groupRouter.post('/create', groupController.createGroup);
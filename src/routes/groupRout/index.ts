import Router from 'express';
import groupController from '../../controllers/groupController';

export const groupRouter = Router();

groupRouter.get('/', groupController.getAll);
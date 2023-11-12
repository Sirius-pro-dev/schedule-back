import Router from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import userController from '../../controllers/userController';

export const userRouter = Router();

userRouter.post('/registration', userController.registration);
userRouter.get('/getTeacherOrGroup', userController.getTeacherOrGroup);
userRouter.post('/login', userController.login);
userRouter.get('/auth', authMiddleware, userController.check);

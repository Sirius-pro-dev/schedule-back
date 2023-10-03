import ApiError from '../error/ApiError';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {

        if (!req.headers.authorization) {
            return next(ApiError.unauthorized(
                'пользователь не авторизован', 
                'userController/auth'));
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, String(process.env.SECRET_KEY));
        req.user = decoded;

        next();
    } catch (e: any) {
        next(ApiError.badGateway(e.message, 'userController'))
    }
};
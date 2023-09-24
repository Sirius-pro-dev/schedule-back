import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
    if (req.method === 'OPTIONS') {
        next();
    }

    try {

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: 'Не авторизован'});
        }

        const decoded = jwt.verify(token, String(process.env.SECRET_KEY));
        req.user = decoded;
        next();

    } catch (e) {
        res.status(401).json({message: 'Не авторизован'});
    }
};
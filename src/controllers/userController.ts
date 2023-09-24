import ApiError from '../error/ApiError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const generateJwt = (userName: string, password: string, role: string) => {
    return jwt.sign(
                {userName, password, role}, 
                String(process.env.SECRET_KEY),
                {expiresIn: '24h'}
    );
}

class UserController {
    static async registration(req: any, res: any, next: any) {
        const {userName, password, name, lastName, surName, role} = req.body;
        if (!userName || !password) {
            return next(ApiError.badRequest(
                'Некорректный userName или password'
            ));
        }

        const candidate = await User.findOne({userName: userName});
        if (candidate) {
            return next(ApiError.badRequest(
                'Пользователь с таким именем уже существует'
            ));
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = new User({
            userName: userName,
            password: hashPassword,
            name: name,
            lastName: lastName,
            surName: surName,
            role: role
        });
        await user.save();
        const token = generateJwt(userName, password, role);

        return res.status(201).json({token}); 
    }

    static async login(req: any, res: any, next: any) {
        const {userName, password} = req.body;
        const user = await User.findOne({userName: userName});
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'));       
        }

        const comparePassword = bcrypt.compareSync(
            password, user.password as any
        );
        if (!comparePassword) {
            return next(ApiError.badRequest('Указан неверный пароль'));        
        }

        const token = generateJwt(userName, password, user.role as any);

        return res.status(200).json({token});
    }

    static async check(req: any, res: any) {
        const token = generateJwt(
            req.user.userName, req.user.password, req.user.role
        );
        return res.status(200).json({token});
    }
}

export default UserController;
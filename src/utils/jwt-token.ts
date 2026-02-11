import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig';
import { UserTokenData } from '../modules/user/types';
export const createToken = (data: UserTokenData) => jwt.sign({
    data: data
}, envConfig.server.jwt_secret, { expiresIn: '7d' });

export const verifyToken = (token: string) => jwt.verify(token, envConfig.server.jwt_secret) as {
    data: UserTokenData;
    iat: number;
    exp: number;
};
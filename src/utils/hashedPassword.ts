import bcrypt from 'bcrypt';
import envConfig from '../config/envConfig';

export const hashedPassword = async (password: string) => await bcrypt.hash(password, envConfig.server.salt_round);

export const comparePassword = async (password: string, hash: string) => await bcrypt.compare(password, hash);
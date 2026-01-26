import { myDataSource } from '../../config/db/db';
import { User } from './user.entity';

export const UserRepository = myDataSource.getRepository(User);
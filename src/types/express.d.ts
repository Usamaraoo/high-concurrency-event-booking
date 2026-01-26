import { User } from '../entities/User'; 

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        // add other fields you need from the token
      };
    }
  }
}
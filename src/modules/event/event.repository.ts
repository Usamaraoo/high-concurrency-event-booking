import { myDataSource } from '../../config/db/db';
import { Event } from './event.entity';

export const EventRepository = myDataSource.getRepository(Event);
import { myDataSource } from '../../config/db/db';
import { Booking } from './booking.entity';

export const BookingRepository = myDataSource.getRepository(Booking);
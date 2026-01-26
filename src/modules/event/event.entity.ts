import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Booking } from '../booking';


@Entity('events')
@Index(['user_id'])
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 255, nullable: false,unique:true })
  name!: string;

  // -------- RELATIONS --------

  @Column({ type: 'uuid' })
  user_id!: string;



  @OneToMany(() => Booking, (booking) => booking.event)
  bookings!: Booking[];

  @Column({ type: 'int', nullable: false })
  seats!: number;

  @Column({ type: 'int', nullable: false })
  available_seats!: number;


  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity'; // Double check if this path is correct
import { Event } from '../event';

export enum BookingStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

@Entity('bookings')
@Index(['user_id'])
@Index(['event_id'])
@Index(['status'])
@Index(['expires_at'])
@Index(['reservation_token'], { unique: true })
@Index(['payment_intent_id'], { unique: true, where: `"payment_intent_id" IS NOT NULL` })
@Index(['payment_id'], { unique: true, where: `"payment_id" IS NOT NULL` })
export class Booking {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  // -------- RELATIONS --------

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  event_id!: string;

  @ManyToOne(() => Event, (event) => event.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  // -------- DATA --------

  @Column({ type: 'int', nullable: false })
  seats!: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.RESERVED,
  })
  status!: BookingStatus;

  @Column({ type: 'timestamptz' })
  expires_at!: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_intent_id!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_id!: string | null;

  @Column({ type: 'varchar', length: 64, unique: true })
  reservation_token!: string;

  // -------- TIMESTAMPS --------

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  confirmed_at!: Date | null;
}
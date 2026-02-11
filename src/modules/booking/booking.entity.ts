import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Event } from '../event';

export enum BookingStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

@Entity('bookings')
@Index(['user_id']) // Now this works!
@Index(['event_id']) // Now this works!
@Index(['status'])
@Index(['expires_at'])
@Index(['reservation_token'], { unique: true })
@Index(['payment_intent_id'], {
  unique: true,
  where: `"payment_intent_id" IS NOT NULL`,
})
@Index(['payment_id'], {
  unique: true,
  where: `"payment_id" IS NOT NULL`,
})
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // -------- FOREIGN KEY COLUMNS (EASY STORAGE) --------

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'uuid' })
  event_id!: string;

  // -------- RELATIONS (FOR JOINING) --------

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // Maps the relation to the column above
  user!: User;

  @ManyToOne(() => Event, (event) => event.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'event_id' }) // Maps the relation to the column above
  event!: Event;

  // -------- DATA --------

  @Column({ type: 'int', nullable: false })
  seats!: number;

  @Column({ type: 'int', nullable: false })
  price!: number;

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

  @Column({ type: 'varchar', length: 512, nullable: true })
  payment_intent_client_secret!: string | null;

  @Column({ type: 'varchar', length: 64, unique: true })
  reservation_token!: string;

  // -------- TIMESTAMPS --------

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  confirmed_at!: Date | null;
}
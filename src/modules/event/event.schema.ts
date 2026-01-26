import { z } from 'zod';

// Match the TypeORM Enum
export enum EventStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
}

export const createEventSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Event name must be at least 3 characters")
      .max(100, "Event name is too long"),
    user_id: z.string().uuid(),
    seats: z.number().int().positive("Total seats must be at least 1"),
    // available_seats is optional in the input because we'll default it
    available_seats: z.number().int().nonnegative().optional(),
    status: z.nativeEnum(EventStatus).default(EventStatus.CONFIRMED),
    payment_id: z.string().max(255).nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    available_seats: data.available_seats ?? data.seats,
  }))
  .refine((data) => data.available_seats <= data.seats, {
    message: "Available seats cannot be greater than total seats",
    path: ["available_seats"],
  });

export type CreateEventInput = z.input<typeof createEventSchema>;
export type CreateEventOutput = z.output<typeof createEventSchema>;
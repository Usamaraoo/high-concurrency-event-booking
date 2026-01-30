import { z } from 'zod';

export const reserveSeatsSchema = z
  .object({
    eventId: z
      .string()
      .uuid("Invalid event ID format"),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase(),
    seats: z
      .number()
      .int()
      .positive("You must reserve at least 1 seat")
      .max(10, "You cannot reserve more than 10 seats at once"), // Optional cap
      
  });


export const createPaymentIntent = z
  .object({
    reservationToken: z
      .string()
      .uuid("Invalid reservation ID format"),

  });

export type ReserveSeat = z.output<typeof reserveSeatsSchema>;
export type CreatePaymentIntent = z.output<typeof createPaymentIntent>;
import { z } from 'zod';

export const reserveSeatsSchema = z
  .object({
    eventId: z
      .string()
      .uuid("Invalid event ID format"),
    seats: z
      .number()
      .int()
      .positive("You must reserve at least 1 seat")
      .max(10, "You cannot reserve more than 10 seats at once"), // Optional cap
    eventPrice: z
      .number()
      .int()
      .positive("You must reserve at least 1 seat")


  });


// export const createPaymentIntentSchema = z.object({
//   params: z.object({
//     eventId: z
//       .string()
//       .uuid("Invalid event ID format"),
//   })
// });

export type ReserveSeat = z.output<typeof reserveSeatsSchema>;
// export type CreatePaymentIntent = z.output<typeof createPaymentIntentSchema>;
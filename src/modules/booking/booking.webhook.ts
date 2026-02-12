import Stripe from "stripe";
import stripe from "../../infra/stripe/stripe.client";
import { Request, Response } from "express";
import { BookingRepository } from "./booking.repository";
import { BookingStatus } from "./booking.entity";
import envConfig from "../../config/envConfig";
import { redisClient } from "../../infra/redis";
import { Event } from "../event/event.entity";
import { myDataSource } from "../../config/db/db";
import { Booking } from "./booking.entity";
import { emailQueue } from "../../infra/queue/email.queue";
export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = envConfig.stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    // req.body MUST be the raw Buffer for this to work
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      endpointSecret
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    console.log('in weebhook')
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata.bookingId as string;
    console.log('paymentIntent', paymentIntent)

      // transaction to update booking and event
      await myDataSource.transaction(async (transactionalEntityManager) => {
        const booking = await transactionalEntityManager.findOne(Booking, {
          where: { id: bookingId },
          lock: { mode: "pessimistic_write" }
        },)
        if(!booking) throw new Error("booking not found")
        if(booking && booking.status !== BookingStatus.RESERVED) return
        const event = await transactionalEntityManager.findOne(Event, {
          where: { id: booking.event_id },
          lock: { mode: "pessimistic_write" }
        },
        )
        if (!event) throw new Error("event not found")
        booking.status = BookingStatus.CONFIRMED;
        booking.payment_id = paymentIntent.id;
        booking.confirmed_at = new Date();
        await transactionalEntityManager.save(booking);
        event.available_seats -= booking.seats;
        await transactionalEntityManager.save(event);
        const reservationKey = `reservation:${booking.event_id}:${booking.seats}:${booking.reservation_token}`;
        await redisClient.del(reservationKey);
        console.log(`✅ Booking ${bookingId} confirmed.`);
        await emailQueue.add('sendConfirmation', {
          bookingId: booking.id,
          eventTitle: event.name,
          userEmail: paymentIntent.metadata.userEmail,
        }, {
          attempts: 3, // Retry 3 times if it fails
          backoff: { type: 'exponential', delay: 5000 } // Wait 5s, then 10s...
        });

        console.log(`✅ Booking ${bookingId} confirmed and job queued.`);

      })

  }

  res.json({ received: true });
}
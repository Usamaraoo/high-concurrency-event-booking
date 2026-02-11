import Stripe from "stripe";
import stripe from "../../infra/stripe/stripe.client";
import { Request, Response } from "express";
import { BookingRepository } from "./booking.repository";
import { BookingStatus } from "./booking.entity";
import envConfig from "../../config/envConfig";
import { redisClient } from "../../infra/redis";
import { Event } from "../event/event.entity";
import { myDataSource } from "../../config/db/db";

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
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata.bookingId as string;

    const booking = await BookingRepository.findOneBy({ id: bookingId });

    if (booking && booking.status !== BookingStatus.CONFIRMED) {

      // transaction to update booking and event
      await myDataSource.transaction(async (transactionalEntityManager) => {
          const event =  await transactionalEntityManager.findOneBy(Event,{ id: booking.event_id  as string })
          if(!event) throw new Error("event not found")
          booking.status = BookingStatus.CONFIRMED;
        booking.payment_id = paymentIntent.id;
          booking.confirmed_at = new Date();
          await transactionalEntityManager.save(booking);
          event.available_seats -= booking.seats;
          await transactionalEntityManager.save(event);
          const reservationKey = `reservation:${booking.event_id}:${booking.seats}:${booking.reservation_token}`;
          await redisClient.del(reservationKey);
          console.log(`✅ Booking ${bookingId} confirmed.`);
      })
      // booking.status = BookingStatus.CONFIRMED;
      // booking.confirmed_at = new Date();
      // await BookingRepository.save(booking);
      // // update event available seats
      // const event = await EventRepository.findOneBy({ id: booking.event_id });
      // if (event) {
      //   event.available_seats -= booking.seats;
      //   await EventRepository.save(event);
      // }
      // console.log(`✅ Booking ${bookingId} confirmed.`);
      // const reservationKey = `reservation:${booking.event_id}:${booking.seats}:${booking.reservation_token}`;
      // await redisClient.del(reservationKey);
    }
  }

  res.json({ received: true });
}
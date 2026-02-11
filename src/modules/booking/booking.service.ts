import { redisClient } from "../../infra/redis/redisClient";
import { reserveSeatLua } from "../../infra/redis/scripts";
import stripe from "../../infra/stripe/stripe.client";
import { BookingStatus } from "./booking.entity";
import { BookingRepository } from "./booking.repository";
import { ReserveSeat } from "./booking.schema"

export const reserveSeat = async (data: ReserveSeat, userId: string) => {

    const { eventId, seats, eventPrice } = data;
    // check if booking exists
    const exists = await BookingRepository.findOneBy({ user_id: userId, event_id: eventId, status: BookingStatus.RESERVED });
    if (exists) {
        return exists
    }
    // create reservation
    const reservationToken = crypto.randomUUID();
    const ttl = 60;

    const reservationKey = `reservation:${eventId}:${seats}:${reservationToken}`;
    const eventKey = `event:available_seats:${eventId}`;

    await redisClient.eval(reserveSeatLua, {
        keys: [
            eventKey,        // KEYS[1]
            reservationKey   // KEYS[2]
        ],
        arguments: [
            seats.toString(), // ARGV[1]
            ttl.toString()    // ARGV[2]
        ]
    });
    const total = seats  * eventPrice;
    // create booking with reservation token
    const booking = await BookingRepository.create({

        user_id: { id: userId } as any,
        event_id: { id: eventId } as any,
        seats,
        status: BookingStatus.RESERVED,
        expires_at: new Date(Date.now() + ttl * 1000),
        reservation_token: reservationToken,
        confirmed_at: null,
        price: total
    })
    // create payment intent 
    const intent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'usd',
        metadata: {
            bookingId: booking.id,
            userId: userId,
            eventId: booking.event_id,
            seats: booking.seats,
            price: booking.price
        }
    })
    booking.payment_intent_id = intent.id;
    booking.payment_intent_client_secret = intent.client_secret;
    await BookingRepository.save(booking);
    return booking;
}


export const getBookingById = async (id: string) => {
    const booking = await BookingRepository.findOneBy({ id });
    if (!booking) throw new Error('Booking not found');
    return booking;
}

// //create payment intent for user
// export const createPaymentIntent = async (userId: string, booking_id: string) => {

//     const booking = await BookingRepository.findOneBy({ user_id: userId, id: booking_id });
//     if (!booking) throw new Error('Booking not found');
//     // extend the redis TTL
//     const reservationKey = `reservation:${booking.event_id}:${booking.seats}:${booking.reservation_token}`
//     redisClient.expire(reservationKey, 120);

//     // create payment intent 
//     const intent = await stripe.paymentIntents.create({
//         amount: booking.price,
//         currency: 'usd',
//         metadata: {
//             bookingId: booking.id,
//             userId: userId,
//             eventId: booking.event_id,
//             seats: booking.seats,
//             price: booking.price
//         }
//     })

//     booking.payment_intent_id = intent.id;
//     await BookingRepository.save(booking);
//     // return payment intent
//     return intent.client_secret;
// }
import { redisClient } from "../../infra/redis/redisClient";
import { reserveSeatLua } from "../../infra/redis/scripts";
import { BookingRepository } from "./booking.repository";
import { CreatePaymentIntent, ReserveSeat } from "./booking.schema"

export const reserveSeat = async (data: ReserveSeat, userId: string) => {
   const { eventId, seats } = data;
    const reservationToken = crypto.randomUUID();
    const ttl = 60;

    // OLD: `reservation:${reservationToken}`
    // NEW: Put all info in the key name separated by colons
    const reservationKey = `reservation:${eventId}:${seats}:${reservationToken}`;
    const eventKey = `event:available_seats:${eventId}`;

    try {
        const result = await redisClient.eval(reserveSeatLua, {
            keys: [
                eventKey,        // KEYS[1]
                reservationKey   // KEYS[2]
            ],
            arguments: [
                seats.toString(), // ARGV[1]
                ttl.toString()    // ARGV[2]
            ]
        });

        return { token: reservationToken, details: result };
    } catch (err: any) {
        // ... handle seeding or errors ...
        throw err;
    }

    // create booking with that user, check if a booking already exist with that user use that




    // send in response
    // res.json({reservation_token: token})
    console.log(data)
}


//create payment intent for user

export const createPaymentIntent = (data: CreatePaymentIntent) => {

    // extend reservation token time

    // create payment intent and and reservation and bookingId
    // update or add the payment intent in db with booking


    // return payment intent


}
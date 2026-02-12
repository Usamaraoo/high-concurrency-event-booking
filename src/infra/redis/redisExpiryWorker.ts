import { BookingStatus } from "../../modules/booking/booking.entity";
import { BookingRepository } from "../../modules/booking/booking.repository";
import { redisClient } from "./index";
import { restoreSeatLua } from "./scripts";

export async function startRedisExpirySubscriber() {
    const sub = redisClient.duplicate();
    await sub.connect();

    // Pattern for expired events
    await sub.pSubscribe('__keyevent@0__:expired', async (key) => {
        if (!key.startsWith('reservation:')) return;

        const parts = key.split(':');

        // Key format: reservation:eventId:seats:token
        const eventId = parts[1];
        const seats = parts[2];

        if (!eventId || !seats) {
            console.error("Invalid key format expired:", key);
            return;
        }

        const eventKey = `event:available_seats:${eventId}`;

        try {
            // Log exactly what is being sent to debug
            console.log(`Attempting restore: Key=${eventKey}, Seats=${seats}`);

            const result = await redisClient.eval(restoreSeatLua, {
                keys: [eventKey],        // This becomes KEYS[1]
                arguments: [seats]       // This becomes ARGV[1]
            });
            console.log(`Successfully restored. New count: ${result}`);
            if (result) {
                let booking = await BookingRepository.findOneBy({ event_id: eventId });
                if (booking) {
                    booking.status = BookingStatus.EXPIRED;
                    await BookingRepository.save(booking);
                    console.log('Booking expired' + booking.id);
                }
            }
        } catch (err: any) {
            // This will now show the detailed "LUA_ERR" we added in the script
            console.error("Failed to restore seats:", err.message);
        }
    });
}
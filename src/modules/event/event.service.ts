import { redisClient } from "../../config/redis"
import { EVENTS } from "../../constant/event"
import { EventRepository } from "./event.repository"
import { CreateEventOutput } from "./event.schema"

// create a new event
export const createEvent = async (eventData: CreateEventOutput) => {
    const created = EventRepository.create(eventData)
    await EventRepository.save(created)
    return created
}

// list all events
export const getEvents = async () => {
    const events = await EventRepository.find()
    return events
}

// seed database with events
export const seedEvents = async (user_id: string) => {
    const events = EVENTS.map((event) => ({ ...event, user_id }))
    const savedEvents = await EventRepository.save(events)
    // cache available seats against each event
    const cachePromises = savedEvents.map(event =>
        redisClient.set(`event:available_seats:${event.id}`, event.available_seats.toString())
    );
    await Promise.all(cachePromises);
}
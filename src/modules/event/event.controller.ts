import { Request, Response } from "express";
import { createEvent, getEvents } from "./event.service";
import { CreateEventOutput } from "./event.schema";
import { sendSuccess } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";



export const createEventController = asyncHandler(async (req: Request<{}, {}, CreateEventOutput>, res: Response) => {
    const event = await createEvent(req.body);
    return sendSuccess(res, event, 'Event created', 201);
});

export const getEventsController = asyncHandler(async (req: Request, res: Response) => {
    
    const events = await getEvents();
    return sendSuccess(res, events, 'Event created', 201);
});
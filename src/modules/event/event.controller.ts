import { Request, Response } from "express";
import { createEvent, getEvents, getEventById } from "./event.service";
import { CreateEventOutput } from "./event.schema";
import { sendSuccess, sendError } from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";



export const createEventController = asyncHandler(async (req: Request<{}, {}, CreateEventOutput>, res: Response) => {
    const event = await createEvent(req.body);
    return sendSuccess(res, event, 'Event created', 201);
});

export const getEventsController = asyncHandler(async (req: Request, res: Response) => {
    console.log(req)
    const events = await getEvents();
    return sendSuccess(res, events, 'Event created', 201);
});

export const getEventController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await getEventById(id as string);
    if (!event) {
        return sendError(res, 'Event not found', 404);
    }
    return sendSuccess(res, event, 'Event found', 200);
});
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // .parseAsync handles transforms and refinements
      const validatedData = await schema.parseAsync(req.body);
      
      // Update body with transformed data (like setting available_seats)
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "validation_error",
          // USE .issues INSTEAD OF .errors
          errors: error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }
      // Pass other unexpected errors to global error handler
      next(error);
    }
  };
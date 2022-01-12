import { NextFunction, Request, Response } from 'express';

export const corsMiddleware = (
  request: Request, 
  response: Response, 
  next: NextFunction
) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  response.header("Access-Control-Allow-Headers", "Content-Type");
  response.header("Access-Control-Expose-Headers", "X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After");
  next();
};
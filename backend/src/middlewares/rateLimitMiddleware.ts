import { NextFunction, Request, Response } from 'express';

import { HttpException } from '../exceptions';

import { RateLimitMemory } from './rateLimitMemory';

import {
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_INTERVAL_IN_MINUTES,
  RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES,
  RATE_LIMIT_CLEAN_INTERVAL_IN_MINUTES,
} from '../config';

const rateLimite = new RateLimitMemory({
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
  limitIntervalInMinutes: RATE_LIMIT_INTERVAL_IN_MINUTES,
  blockIntervalInMinutes: RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES,
  cleanIntervalInMinutes: RATE_LIMIT_CLEAN_INTERVAL_IN_MINUTES,
});

const setRateLimitHeaders = (response: Response, ip: string) => {
  response.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
  const requestInfo = rateLimite.get(ip);
  if (requestInfo) {
    response.setHeader('X-RateLimit-Remaining', requestInfo.requestRemaining);
    if (requestInfo.blockUntil) {
      const retryAfterSeconds = requestInfo.blockUntil - Date.now();
      response.setHeader('Retry-After', Math.ceil(Math.max(retryAfterSeconds, 0) / 1000));
    }
  }
}

export const rateLimitMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const ip = request.ip;

    if (!rateLimite.isAllow(ip)) {
      setRateLimitHeaders(response, ip);
      return next(
        new HttpException(429, `You have exceeded the ${RATE_LIMIT_MAX_REQUESTS} requests in ${RATE_LIMIT_INTERVAL_IN_MINUTES} minutes.`)
      );
    }

    setRateLimitHeaders(response, ip);

    next();
  } catch (error) {
    next(error);
  }
}
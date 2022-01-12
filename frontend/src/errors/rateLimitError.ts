import { RequestRateLimit } from "../types";

export class RateLimitError extends Error {
  status: number;
  message: string;
  rateLimit: RequestRateLimit;
  constructor(status: number, message: string, rateLimit: RequestRateLimit) {
    super(message);
    this.status = status;
    this.message = message;
    this.rateLimit = rateLimit;
  }
}
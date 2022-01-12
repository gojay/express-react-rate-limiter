import { RateLimitError } from "../errors";
import { RequestRateLimit } from "../types";

export class CarService {
  static readonly API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  static async Fetch<T>(): Promise<{ data: T[] } & RequestRateLimit> {
    const response = await fetch(`${this.API_BASE_URL}/api/cars`);
    const json = await response.json();
    const rateLimit = this.getRequestRateLimit(response);
    if (!response.ok) {
      throw new RateLimitError(response.status, json.message ?? response.statusText, rateLimit)
    }
    return {
      data: json as T[],
      ...rateLimit
    };
  }

  private static getRequestRateLimit(response: Response): RequestRateLimit {
    const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const retryAfter = response.headers.get('Retry-After');

    return {
      rateLimitLimit: rateLimitLimit ? Number(rateLimitLimit) : null,
      rateLimitRemaining: rateLimitLimit ? Number(rateLimitRemaining) : null,
      retryAfter: rateLimitLimit ? Number(retryAfter) : null,
    }
  }
}
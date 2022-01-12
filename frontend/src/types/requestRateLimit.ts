export type RequestRateLimit = {
  rateLimitLimit: number | null,
  rateLimitRemaining: number | null,
  retryAfter: number | null
}
export const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS as string, 10) ?? 10; 
export const RATE_LIMIT_INTERVAL_IN_MINUTES = parseInt(process.env.RATE_LIMIT_INTERVAL_IN_MINUTES as string, 10) ?? 10;
export const RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES = parseInt(process.env.RATE_LIMIT_BLOCK_INTERVAL_IN_MINUTES as string, 10) ?? 15; 
export const RATE_LIMIT_CLEAN_INTERVAL_IN_MINUTES = parseInt(process.env.RATE_LIMIT_CLEAN_INTERVAL_IN_MINUTES as string, 10) ?? 5; 
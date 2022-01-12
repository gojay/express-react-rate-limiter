import { Logger } from "tslog";
import { IRateLimiterRequestInfo } from '../interfaces';

export class RateLimitMemory {
  private readonly maxRequests: number;
  private readonly limitIntervalInMs: number;
  private readonly blockIntervalInMs: number;
  private readonly logger: Logger;

  private requestMap: Map<string, IRateLimiterRequestInfo>;

  constructor(
    config: {
      maxRequests: number,
      limitIntervalInMinutes: number,
      blockIntervalInMinutes: number,
      cleanIntervalInMinutes?: number,
    },
  ) {
    const { maxRequests, limitIntervalInMinutes, blockIntervalInMinutes, cleanIntervalInMinutes } = config;

    this.maxRequests = maxRequests;
    this.limitIntervalInMs = limitIntervalInMinutes * 60 * 1000;
    this.blockIntervalInMs = blockIntervalInMinutes * 60 * 1000;

    this.logger = new Logger({
      prefix: ['RateLimiterMemory'],
      displayFunctionName: false,
      displayFilePath: 'hidden',
      type: process.env.NODE_ENV === 'test' ? 'hidden' : 'pretty'
    });
    this.requestMap = new Map();

    if (cleanIntervalInMinutes) {
      setInterval(this.clean, cleanIntervalInMinutes * 60 * 1000).unref();
    }
  }

  isAllow(ip: string): boolean {
    const now = Date.now();

    const { blockUntil, requestTimes } = this.get(ip);

    if (!!blockUntil && blockUntil >= now) {
      this.logger.error(`[IP=${ip}] Not Allowed. requested at ${new Date(now).toISOString()}, blocked until ${new Date(blockUntil).toISOString()}`);
      return false;
    }

    requestTimes.push(now);

    if (requestTimes.length < this.maxRequests) {
      this.logger.info(`[IP=${ip}] requested at ${new Date(now).toISOString()}, request count = ${requestTimes.length}`);
      this.set(ip, { requestTimes, requestRemaining: Math.max(this.maxRequests - requestTimes.length, 0) });
      return true;
    }

    const limit = now - this.limitIntervalInMs;

    let requestsCount = 0;
    for (let i = requestTimes.length - 1; i >= 0; i--) {
      if (requestTimes[i] > limit) {
        requestsCount++;
      } else {
        break;
      }
    }

    this.logger.info(`[IP=${ip}] requested at ${new Date(now).toISOString()}, requests count = ${requestsCount}`);

    if (requestsCount > this.maxRequests) {
      this.set(ip, {
        blockUntil: now + this.blockIntervalInMs,
        requestRemaining: 0
      });
      const limitIntervalInMinutes = this.limitIntervalInMs / 60 / 1000;
      this.logger.error(`[IP=${ip}] Not Allowed. Maximum requests exceeded ${requestsCount}/${this.maxRequests} per ${limitIntervalInMinutes} minutes`);
      return false;
    }

    this.set(ip, { requestTimes, requestRemaining: Math.max(this.maxRequests - requestsCount, 0) });

    return true;
  }

  get(ip: string): IRateLimiterRequestInfo {
    if (!this.requestMap.has(ip)) {
      this.requestMap.set(ip, { requestTimes: [], requestRemaining: this.maxRequests });
    }
    return this.requestMap.get(ip) as IRateLimiterRequestInfo;
  }

  set(ip: string, values: Partial<IRateLimiterRequestInfo>): void {
    const requestInfo = this.get(ip);
    this.requestMap.set(ip, { ...requestInfo, ...values });
  }

  del(ip: string): void {
    this.requestMap.delete(ip);
  }

  clean = () => {
    const now = Date.now();
    const limit = now - this.limitIntervalInMs;

    this.logger.info('clean scheduler starting...');

    for (const [ip, requestInfo] of this.requestMap) {
      const { blockUntil, requestTimes } = requestInfo;

      if (!!blockUntil && blockUntil < now) {
        if (!requestTimes || requestTimes[requestTimes.length - 1] < limit) {
          this.del(ip);
        } else {
          if (requestTimes.length > this.maxRequests && requestTimes[0] < limit) {
            let index = 0;
            for (let i = 1; i < requestTimes.length; i++) {
              if (requestTimes[i] < limit) {
                index = 1;
              } else {
                break;
              }
            }
            requestTimes.splice(0, index + 1);
            this.set(ip, { requestTimes, requestRemaining: this.maxRequests - requestTimes.length })
          }
        }
      }
    }

    this.logger.info('clean done', this.requestMap.entries());
  }
}
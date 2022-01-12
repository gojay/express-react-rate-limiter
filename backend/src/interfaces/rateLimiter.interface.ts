export interface IRateLimiterRequestInfo {
  requestTimes: number[];
  requestRemaining: number;
  blockUntil?: number;
}
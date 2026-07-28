import Elysia from "elysia";

type Bucket = { 
  count: number, 
  resetAt: number
}
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60000;
const MAX_REQUESTS = 10;

const checkRateLimit = (ip: string) : { allowed: boolean, retryAfter?: number} => {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if(!bucket || now > bucket.resetAt) {
    buckets.set(ip, { 
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return { allowed: true }
  }

  if(bucket?.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket?.resetAt - now) / 1000)
    }
  }

  bucket.count++;
  return { allowed: true };
}

setInterval(() => {
  const now = Date.now();
  for(const [ip, b] of buckets) {
    if (now > b.resetAt) {
      buckets.delete(ip);
    }
  }
}, WINDOW_MS);

export const rateLimitModule = () => new Elysia()
  .derive({as: "global"}, ({request, server}) => {
    const headers = request.headers;
    const ip = 
      headers.get("cf-connecting-ip") ||
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headers.get("x-real-ip") ||
      server?.requestIP(request)?.address ||
      "unknown";
    return { clientIp: ip}
  })
  .onBeforeHandle({as: "global"}, ({clientIp, set}) => {
    const { allowed, retryAfter } = checkRateLimit(clientIp);
    if(!allowed) {
      set.status = 429;
      set.headers["retry-after"] = String(retryAfter);
      return { error: "Too many requests" }
    }
  })
import { sleep } from "bun";

interface QueueTask<T> {
  fn: () => Promise<T>;
  estimatedTokens: number;
  resolve: (value: T) => void;
  reject: (err: unknown) => void;
}

class AIQueue {
  private queue: QueueTask<any>[] = [];
  private processing = false;

  private maxRequestsPerMinute;
  private maxTokensPerMinute;
  private maxConcurrent;

  constructor(maxRPM: number, maxTPM: number, maxC: number) {
    this.maxRequestsPerMinute = maxRPM;
    this.maxTokensPerMinute = maxTPM;
    this.maxConcurrent = maxC;
  }

  private requestTimestamps: number[] = [];
  private tokenUsage: { timestamp: number; tokens: number }[] = [];
  private activeCount = 0;

  enqueue<T>(fn: () => Promise<T>, estimatedTokens = 500): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, estimatedTokens, resolve, reject });
      this.tryProcess();
    });
  }

  private cleanupWindow() {
    const oneMinuteAgo = Date.now() - 60_000;
    this.requestTimestamps = this.requestTimestamps.filter((t) => t > oneMinuteAgo);
    this.tokenUsage = this.tokenUsage.filter((u) => u.timestamp > oneMinuteAgo);
  }

  private currentTokenUsage() {
    return this.tokenUsage.reduce((sum, u) => sum + u.tokens, 0);
  }

  private async tryProcess() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      this.cleanupWindow();

      if (this.activeCount >= this.maxConcurrent) {
        await sleep(200);
        continue;
      }

      const next = this.queue[0];
      if (!next) break;

      if (this.requestTimestamps.length >= this.maxRequestsPerMinute) {
        const oldestTimestamp = this.requestTimestamps[0];
        if (oldestTimestamp !== undefined) {
          const waitMs = 60_000 - (Date.now() - oldestTimestamp);
          await sleep(Math.max(waitMs, 100));
        }
        continue;
      }

      if (this.currentTokenUsage() + next.estimatedTokens > this.maxTokensPerMinute) {
        await sleep(1000);
        continue;
      }

      this.queue.shift();
      this.requestTimestamps.push(Date.now());
      this.tokenUsage.push({ timestamp: Date.now(), tokens: next.estimatedTokens });
      this.activeCount++;

      this.runTask(next);
    }

    this.processing = false;
  }

  private async runTask<T>(task: QueueTask<T>) {
    const maxRetries = 5;
    let attempt = 0;

    while (true) {
      try {
        const result = await task.fn();
        task.resolve(result);
        break;
      } catch (err: any) {
        const is429 = err?.status === 429 || err?.message?.includes("429");
        if (!is429 || attempt >= maxRetries) {
          task.reject(err);
          break;
        }
        attempt++;
        const retryAfter = err?.headers?.["retry-after"];
        const backoffMs = retryAfter
          ? Number(retryAfter) * 1000
          : Math.min(1000 * 2 ** attempt, 30_000) + Math.random() * 500;
        await sleep(backoffMs);
      }
    }
    this.activeCount--;
    this.tryProcess();
  }
}

export const aiQueue = new AIQueue(100, 30000, 5);
import { connect, parseURL } from "https://deno.land/x/redis/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

console.log(config({ safe: true }), 'logogoogoogogogogogogo');
const { REDIS_URL } = config({ safe: true });
const options = parseURL(REDIS_URL);
const client = connect(options);

export async function initRedis(): Promise<void> {
  const redis = await client;
  if (redis.isConnected) {
    return;
  }
  throw new Error("Call initRedis first");
}

export async function setKey(key: string, data: unknown): Promise<void> {
  const redis = await client;
  if (!redis.isConnected || redis.isClosed) {
    throw new Error("Call initRedis first");
  }

  log.info(`Saving {yellow "${key}: ${JSON.stringify(data)}"} in datastore...`);
  redis.set(key, data as string);
}

export async function getKey(key: string): Promise<string | null> {
  const redis = await client;
  if (!redis.isConnected || redis.isClosed) {
    throw new Error("Call initRedis first");
  }

  const data = await redis.get(key);
  if (!data) {
    return null;
  }

  return data;
}

export async function hasKey(key: string): Promise<boolean> {
  const value = await getKey(key);

  return !!value;
}

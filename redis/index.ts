import { connect, parseURL } from "https://deno.land/x/redis/mod.ts";
import * as log from "https://deno.land/std@0.82.0/log/mod.ts";

const { REDIS_URL } = Deno.env.toObject();
const options = parseURL(REDIS_URL);
const client = connect(options);

export async function initRedis(): Promise<void> {
  const redis = await client;
  if (redis.isConnected) {
    return;
  }
  return Promise.reject(new Error("Call initRedis first"));
}

export async function setKey(key: string, data: unknown): Promise<void> {
  const redis = await client;
  if (!redis.isConnected || redis.isClosed) {
    throw new Error("Call initRedis first");
  }

  log.info(`Saving ${key}: ${JSON.stringify(data)} in Redis...`);
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

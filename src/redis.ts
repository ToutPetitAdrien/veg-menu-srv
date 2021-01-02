import { log, redisConnect, parseURL } from "../deps.ts";

const { REDIS_URL } = Deno.env.toObject();
const options = parseURL(REDIS_URL);
const client = redisConnect(options);

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

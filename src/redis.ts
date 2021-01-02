import { log, parseURL, redisConnect } from "../deps.ts";

const { REDIS_URL } = Deno.env.toObject();
const options = parseURL(REDIS_URL);
const client = redisConnect(options);

export type RedisService = {
  initRedis: () => Promise<void>;
  setKey: (key: string, data: unknown) => Promise<void>;
  hasKey: (key: string) => Promise<boolean>;
  getKey: (key: string) => Promise<string | null>;
};

export const redisService = (): RedisService => {
  const initRedis = async (): Promise<void> => {
    const redis = await client;
    if (redis.isConnected) {
      return;
    }
    return Promise.reject(new Error("Call initRedis first"));
  };

  const setKey = async (key: string, data: unknown): Promise<void> => {
    const redis = await client;
    if (!redis.isConnected || redis.isClosed) {
      throw new Error("Call initRedis first");
    }

    log.info(`Saving ${key}: ${JSON.stringify(data)} in Redis...`);
    redis.set(key, data as string);
  };

  const getKey = async (key: string): Promise<string | null> => {
    const redis = await client;
    if (!redis.isConnected || redis.isClosed) {
      throw new Error("Call initRedis first");
    }

    const data = await redis.get(key);
    if (!data) {
      return null;
    }

    return data;
  };

  const hasKey = async (key: string): Promise<boolean> => {
    const value = await getKey(key);

    return !!value;
  };

  return {
    initRedis,
    setKey,
    hasKey,
    getKey,
  };
};

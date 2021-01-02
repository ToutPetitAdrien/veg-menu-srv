import { log } from "../deps.ts";

import { baseUrl } from "./constants.ts";
import { RedisService } from "./redis.ts";

export function buildUrl({ page = 1 }: { [page: string]: number }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ""}`;
}

export function dateToTimestamp(date?: string): number | void {
  if (!date) {
    return;
  }

  return new Date(date).getTime() / 1000;
}

export async function isRecipeAlreadyIndexed(
  redis: RedisService,
  slug: string,
): Promise<boolean> {
  const isAlreadyIndexed = await redis.hasKey(slug);
  log.info(`${slug} is ${isAlreadyIndexed ? "already" : "not yet"} indexed`);
  return isAlreadyIndexed;
}

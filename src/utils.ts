import * as log from "https://deno.land/std@0.79.0/log/mod.ts";

import { baseUrl } from "./constants.ts";
import { hasKey } from "./redis.ts";

export function buildUrl({ page = 1 }: { [page: string]: number }): string {
  return `${baseUrl}/recettes${page > 1 ? `/page/${page}` : ""}`;
}

export function dateToTimestamp(date?: string): number | void {
  if (!date) {
    return;
  }

  return new Date(date).getTime() / 1000;
}

export async function isRecipeAlreadyIndexed(slug: string): Promise<boolean> {
  const isAlreadyIndexed = await hasKey(slug);
  log.info(`${slug} is ${isAlreadyIndexed ? "already" : "not yet"} indexed`);
  return isAlreadyIndexed;
}

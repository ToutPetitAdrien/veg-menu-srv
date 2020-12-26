import * as log from "https://deno.land/std@0.82.0/log/mod.ts";
import { hasKey } from "../redis/index.ts";

export async function isRecipeAlreadyIndexed(slug: string): Promise<boolean> {
  const isAlreadyIndexed = await hasKey(slug);
  log.info(`${slug} is ${isAlreadyIndexed ? "already" : "not yet"} indexed`);
  return isAlreadyIndexed;
}

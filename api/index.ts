import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { baseUrl } from "../constants.ts";

export async function api(path: string): Promise<string> {
  try {
    const result = await fetch(`${baseUrl}${path}`);
    return await result.text();
  } catch (error) {
    log.error(`Could not fetch {yellow ${path}}`);
    throw new Error(error);
  }
}

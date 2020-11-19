import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

import { buildUrl } from "../utils.ts";
import { sendToRecipeParser } from "../workers/recipeParser.ts";
import { PageSlugsRecipes } from "../types.ts";
import { parsePagesNumber } from "../parsers/page.ts";
import { parseAllRecipesSlugs } from "../parsers/slug.ts";

export async function main(): Promise<void> {
  const nbPages = await getPagesNumber();
  const nbPagesByJob = 1;
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage: number = Math.floor(Math.random() * Math.floor(nbPages));
    log.info(`Start job for page n°${randomPage}`);

    const result: PageSlugsRecipes = await getAllRecipesSlugs(
      { page: randomPage },
    );

    for (const slug of result.slugsList) {
      await sendToRecipeParser(slug);
      // if (!(await isRecipeAlreadyIndexed(slug))) {
      // }
    }
  }
}

export async function getPagesNumber(): Promise<
  number
> {
  const url = buildUrl({});
  const result = await fetch(url);

  return parsePagesNumber(await result.text());
}

export async function getAllRecipesSlugs(
  { page }: { [page: string]: number },
): Promise<
  PageSlugsRecipes
> {
  const url = buildUrl({ page });
  const result = await fetch(url);

  const slugsList = parseAllRecipesSlugs(await result.text());
  log.info(`Slug list for page n°${page} retrieved: ${slugsList}`);
  return slugsList;
}

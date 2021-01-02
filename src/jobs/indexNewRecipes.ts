import { log } from "../../deps.ts";

import { buildUrl } from "../utils.ts";
import { sendToRecipeParser } from "../workers/recipeParser.ts";
import { PageSlugsRecipes } from "../types.ts";
import { parsePagesNumber } from "../parsers/page.ts";
import { parseAllRecipesSlugs } from "../parsers/slug.ts";
import { isRecipeAlreadyIndexed } from "../utils.ts";

import { redisService } from "../redis.ts";

export async function main(): Promise<void> {
  const redis = redisService();

  const nbPages = await getPagesNumber();
  const nbPagesByJob = 1;
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage: number = Math.floor(Math.random() * Math.floor(nbPages));
    log.info(`Start job for page n°${randomPage}`);

    const result: PageSlugsRecipes = await getAllRecipesSlugs(
      { page: randomPage },
    );

    for (const slug of result.slugsList) {
      if (!(await isRecipeAlreadyIndexed(slug))) {
        await sendToRecipeParser(slug);
      }
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

  const slugsList = await parseAllRecipesSlugs(await result.text());
  return {
    page,
    slugsList,
  };
}

import * as log from "https://deno.land/std@0.79.0/log/mod.ts";

import { buildUrl } from "../utils.ts";
import { sendToRecipeParser } from "../workers/recipeParser.ts";
import { PageSlugs } from "../types.ts";
import { parsePagesNumber } from "../parsers/page.ts";
import { parseAllRecipesSlugs } from "../parsers/slug.ts";
import { isSlugAlreadyIndexed } from "../utils/index.ts";

export async function main(): Promise<void> {
  const url = buildUrl({});
  const result = await fetch(url);
  const nbPages = parsePagesNumber(await result.text())

  const nbPagesByJob = 1;
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage: number = Math.floor(Math.random() * Math.floor(nbPages));
    log.info(`Start job for page n°${randomPage}`);

    const result: PageSlugs = await getAllRecipesSlugs(
      { page: randomPage },
    );

    for (const slug of result.slugsList) {
      if (!(await isSlugAlreadyIndexed(slug))) {
        await sendToRecipeParser(slug);
      }
    }
  }
}

export async function getAllRecipesSlugs(
  { page }: { [page: string]: number },
): Promise<
  PageSlugs
> {
  const url = buildUrl({ page });
  const result = await fetch(url);

  const slugsList = await parseAllRecipesSlugs(await result.text());
  return {
    page,
    slugsList,
  };
}

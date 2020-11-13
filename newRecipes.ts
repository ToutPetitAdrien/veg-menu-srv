import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { buildUrl } from "./utils.ts";
import * as rustParser from "./rust-parser/pkg/rust_parser.js";
import { parse } from 'https://cdn.skypack.dev/node-html-parser?dts';
import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";

import { PageSlugsRecipes } from "./types.ts";

export async function main(): Promise<void> {
  const nbPages = await getPagesNumber2();
  log.info(`menu-vegetarien.com has ${nbPages} recipes's pages`);
  const nbPagesByJob = 10;
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage = Math.floor(Math.random() * Math.floor(nbPages));
    log.info(`Start job for page n°${randomPage}`);

    // const result = await getAllRecipesSlugs({ page: randomPage });
    // console.log(result)

    // for (const slug of result.data) {
    //   if (!(await isRecipeAlreadyIndexed(slug))) {
    //     await sendToRecipeParser(slug);
    //   }
    // }
  }
}

export async function getPagesNumber(): Promise<
  number
> {
  const url = buildUrl({});
  const result = await fetch(url);

  const nbPages = rustParser.parse_pages_number(await result.text());

  return nbPages;
}

export async function getPagesNumber2(): Promise<
  number
> {
  const url = buildUrl({});
  const result = await fetch(url);
  const root = parse(await result.text());

  const pageNumberNodes = root.querySelectorAll("nav.elementor-pagination a.page-numbers")
  const lastPageNumber = R.last(pageNumberNodes).childNodes

  return Number(R.last(lastPageNumber).rawText);
}

// export async function getAllRecipesSlugs({ page }: { [page: string]: number }): Promise<
//   PageSlugsRecipes
// > {
//   const url = buildUrl({ page })
//   const result = await fetch(url);
//   log.info(`Successfully requested page n°${page}`);
//   const slugsList = rustParser.parse_recipes_slugs(await result.text());
//   log.info(slugsList);

//   return {
//     page,
//     slugsList
//   }
// }

// export async function getRecipesSlugsLight({ page = 1 } = {}): Promise<
//   Pick<PaginationResult<string>, 'data' | 'page'>
// > {
//   const url = buildUrl({ page })
//   const result = await request.get(url)
//   if (result.status !== 200) {
//     return { data: [], page }
//   }
//   signale.success(`Successfully requested page n°${page}`)
//   const { data } = parseRecipesListLight(result)

//   return {
//     data,
//     page
//   }
// }

main();

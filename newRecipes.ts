import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { buildUrl } from "./utils.ts";
import * as rustParser from "./rust-parser/pkg/rust_parser.js"

export async function main(): Promise<void> {
  const nbPages = await getPagesNumber();
  const nbPagesByJob = 10;
  for (let i = 0; i < nbPagesByJob; i++) {
    const randomPage = Math.floor(Math.random() * Math.floor(nbPages));
    log.info(`Start job for page n°${randomPage}`);

    // const result = await getRecipesSlugsLight({ page: randomPage });

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
  const url = buildUrl({ page: 1 });
  const result = await fetch(url);

  const nbPages = rustParser.parse_pages_number(await result.text());

  return nbPages;
}

main();

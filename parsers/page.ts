import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";
import * as log from "https://deno.land/std@0.76.0/log/mod.ts";
import { parse } from "https://cdn.skypack.dev/node-html-parser?dts";

export const parsePagesNumber = (html: string): number => {
  const root = parse(html);

  const pageNumberNodes = root.querySelectorAll(
    "nav.elementor-pagination a.page-numbers",
  );
  const lastPageNumber = R.last(pageNumberNodes).childNodes;

  const nbPages: number = Number(R.last(lastPageNumber).rawText);
  log.info(`menu-vegetarien.com has ${nbPages} recipes's pages`);
  return nbPages;
};

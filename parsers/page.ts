import * as R from "https://x.nest.land/ramda@0.27.0/source/index.js";
import * as log from "https://deno.land/std@0.74.0/log/mod.ts";

import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const parsePagesNumber = async (): Promise<number> => {
  const result = await fetch("https://menu-vegetarien.com/recettes");

  const root = new DOMParser().parseFromString(
    await result.text(),
    "text/html",
  );
  const pageNumberNodes = root?.querySelectorAll(
    "nav.elementor-pagination a.page-numbers",
  );
  const lastPageNumber = R.last(pageNumberNodes).childNodes;
  const nbPages: number = Number(R.last(lastPageNumber).data);
  log.info(`menu-vegetarien.com has ${nbPages} recipes's pages`);

  return nbPages;
};

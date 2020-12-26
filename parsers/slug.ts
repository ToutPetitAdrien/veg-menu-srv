import { buildUrl } from "../utils.ts";

import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

export const parseAllRecipesSlugs = async (
  html: string,
): Promise<Array<string>> => {
  const root = new DOMParser().parseFromString(
    html,
    "text/html",
  );
  if (!root) {
    return [];
  }
  const recipes = root.getElementsByClassName("recipe");

  let slugsList: Array<string> = [];
  for (const recipe of recipes) {
    const fullUrl = recipe.querySelector("a.elementor-post__read-more")
      ?.getAttribute("href");
    if (!fullUrl) {
      continue;
    }
    const [, slug]: Array<string> =
      /https:\/\/menu-vegetarien\.com\/recettes\/([a-z0-9-]*)/.exec(fullUrl) ||
      [];
    slugsList = [...slugsList, slug];
  }

  return slugsList;
};

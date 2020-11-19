import { parse } from "https://cdn.skypack.dev/node-html-parser?dts";

export const parseAllRecipesSlugs = (html: string): Array<string> => {
  const root = parse(html);

  const recipes = root.querySelectorAll("div.elementor-posts article");

  let slugsList: Array<string> = [];
  for (const recipe of recipes) {
    const url: string =
      recipe.querySelector("a.elementor-post__read-more").attributes.href;
    const [, slug]: Array<string> =
      /https:\/\/menu-vegetarien\.com\/recettes\/([a-z0-9-]*)/.exec(url) || [];
    slugsList = [...slugsList, slug];
  }

  return slugsList;
};

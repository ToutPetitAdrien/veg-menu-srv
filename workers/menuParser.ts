import { sendToQueue } from "../rabbitmq/index.ts";
import { Queue } from "../types.ts";
import { sendToMenuIndexer } from "./menuIndexer.ts";
import { dateToTimestamp } from "../utils.ts";
import { parseRecipe } from "../parsers/recipe.ts";
import { WeeklyMenu } from "../types.ts";
import { api } from "../api/index.ts";

export const queue = Queue.MenuParser;

export async function sendToMenuParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug);
}

export async function work(slug: string): Promise<void> {
  const menu = await getMenu(slug);
  await sendToMenuIndexer(menu);
}

export async function getMenu(slug: string): Promise<WeeklyMenu> {
//   const html = await api(`/recettes/${slug}`);
//   const recipe = parseRecipe(html);
//   const createdAtTimestamp = dateToTimestamp(recipe.createdAt);

//   const fullRecipe: WeeklyMenu = {
//     ...recipe,
//     slug,
//     createdAtTimestamp: createdAtTimestamp as number,
//   };
//   return fullRecipe;
}

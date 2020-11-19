import * as log from "https://deno.land/std@0.76.0/log/mod.ts";

import { sendToQueue } from "../rabbitmq/index.ts";
import { Queue } from "../types.ts";
// import { sendToRecipeIndexer } from './recipeIndexer'
import { dateToTimestamp } from "../utils.ts";
import { parseRecipe } from "../parsers/recipe.ts";
import { Recipe } from "../types.ts";

export const queue = Queue.RecipeParser;

export async function sendToRecipeParser(slug: string): Promise<void> {
  await sendToQueue(queue, slug);
}

export async function work(slug: string): Promise<void> {
  const recipe = await getRecipe(slug);
  console.log(recipe)
  // await sendToRecipeIndexer(recipe)
}

export async function getRecipe(slug: string): Promise<Recipe> {
  const result = await fetch(`/recettes/${slug}`);
  const recipe = parseRecipe(await result.text());
  log.info(`Parsing ${slug} gives: ${recipe}`);
  const createdAtTimestamp = dateToTimestamp(recipe.createdAt);

  recipe.slug = slug;
  recipe.createdAtTimestamp = createdAtTimestamp as number;
  return recipe;
}
